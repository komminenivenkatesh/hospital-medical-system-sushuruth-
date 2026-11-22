const AiConversation = require('../models/AiConversation');
const Doctor = require('../models/Doctor');

// Helper to determine clinical specialty based on user prompt
function detectSpecialtyAndGuidance(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes('migraine') || text.includes('headache') || text.includes('numbness') || text.includes('dizziness') || text.includes('vertigo') || text.includes('seizure') || text.includes('stroke')) {
    return {
      specialty: 'Neurology',
      assessment: `Based on your neurological symptoms, these could range from vascular tension to primary headache disorders or nerve irritation.\n\n` +
        `**Key Considerations:**\n` +
        `- Keep a symptom log noting onset time, duration, and associated triggers (light, sound, food).\n` +
        `- Stay adequately hydrated and rest in a dark, quiet room during acute flare-ups.\n\n` +
        `> ⚠️ **Urgent Red Flags:** If you experience sudden "thunderclap" headache, weakness on one side of the face or body, slurred speech, or high fever with stiff neck, seek emergency medical care immediately.\n\n` +
        `We recommend consulting a **Neurologist** for a thorough clinical examination and targeted therapeutic regimen.`,
    };
  }

  if (text.includes('chest') || text.includes('heart') || text.includes('palpitation') || text.includes('blood pressure') || text.includes('hypertension') || text.includes('bp')) {
    return {
      specialty: 'Cardiology',
      assessment: `Cardiovascular health requires prompt and proactive evaluation.\n\n` +
        `**Lifestyle & Monitoring Tips:**\n` +
        `- Check your blood pressure reading twice daily (morning and evening) in a relaxed sitting position.\n` +
        `- Avoid excessive sodium, caffeine, and tobacco.\n` +
        `- Maintain gentle walking routines if asymptomatic.\n\n` +
        `> ⚠️ **Urgent Red Flags:** If chest tightness radiates to your jaw, left arm, or back, or is accompanied by shortness of breath and cold sweat, call an ambulance immediately.\n\n` +
        `A consultation with a **Cardiologist** is advised to review your ECG and cardiovascular parameters.`,
    };
  }

  if (text.includes('anxiety') || text.includes('sleep') || text.includes('insomnia') || text.includes('stress') || text.includes('panic') || text.includes('depress')) {
    return {
      specialty: 'Psychiatry',
      assessment: `Mental wellness and physical recovery are deeply intertwined.\n\n` +
        `**Actionable Self-Care Measures:**\n` +
        `- **Box Breathing:** Inhale 4 counts, hold 4 counts, exhale 4 counts, hold 4 counts.\n` +
        `- **Sleep Hygiene:** Ensure no screens 1 hour prior to sleep; maintain consistent sleep-wake times.\n` +
        `- Limit late-afternoon caffeine intake.\n\n` +
        `> 💡 Mental health concerns respond exceptionally well to modern evidence-based psychotherapy and medical guidance.\n\n` +
        `We suggest connecting with a qualified **Psychiatrist or Therapist** on Sushruth.`,
    };
  }

  if (text.includes('mri') || text.includes('ct') || text.includes('scan') || text.includes('x-ray') || text.includes('report') || text.includes('white matter')) {
    return {
      specialty: 'Neurology',
      assessment: `Medical imaging reports require clinical correlation with your physical symptoms.\n\n` +
        `**Understanding Imaging Findings:**\n` +
        `- Phrases like "mild white matter changes" are frequently incidental and common with healthy aging or vascular tension.\n` +
        `- Scans should always be evaluated in the context of your physical examination rather than in isolation.\n\n` +
        `> 📋 You can upload your scan file in the Sushruth **MRI & Diagnostics Vault** for secondary review by our clinical specialists.`,
    };
  }

  if (text.includes('ibuprofen') || text.includes('paracetamol') || text.includes('medicine') || text.includes('tablet') || text.includes('drug') || text.includes('interaction')) {
    return {
      specialty: 'General Physician',
      assessment: `Pharmacological interactions can alter therapeutic efficacy and safety.\n\n` +
        `**Important Clinical Notes:**\n` +
        `- NSAIDs (like ibuprofen) can reduce the effectiveness of certain blood pressure medications and place additional stress on kidneys.\n` +
        `- Paracetamol is generally safer for mild-to-moderate pain when no liver contraindications exist.\n\n` +
        `> ⚠️ Never alter prescribed dosages or begin new medication combinations without consulting your prescribing physician.`,
    };
  }

  // Default General Medical Response
  return {
    specialty: 'General Physician',
    assessment: `Thank you for consulting Sushruth Health Assistant.\n\n` +
      `Here is evidence-based clinical guidance regarding your query:\n` +
      `- Maintain balanced hydration, adequate rest, and nutrient-rich meals.\n` +
      `- Monitor any progression or new associated symptoms over the next 24 to 48 hours.\n\n` +
      `> ℹ️ For an accurate diagnosis and individualized treatment plan, a verified clinician consultation is strongly recommended.`,
  };
}

/**
 * @desc Get all AI conversations for current user
 * @route GET /api/ai/conversations
 */
const getAiConversations = async (req, res, next) => {
  try {
    const conversations = await AiConversation.find({ user: req.user._id })
      .select('title lastMessage createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single AI conversation with messages
 * @route GET /api/ai/conversations/:id
 */
const getAiConversationById = async (req, res, next) => {
  try {
    const conversation = await AiConversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Send message to AI assistant
 * @route POST /api/ai/chat
 */
const sendAiMessage = async (req, res, next) => {
  try {
    const { prompt, conversationId } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt text is required' });
    }

    const { specialty, assessment } = detectSpecialtyAndGuidance(prompt);

    // Fetch matching verified doctors from MongoDB
    const matchingDocs = await Doctor.find({
      $or: [
        { specialty: new RegExp(specialty, 'i') },
        { verificationStatus: 'Approved' },
      ],
    })
      .populate('user', 'name avatar')
      .limit(3);

    const suggestedDoctors = matchingDocs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.user?.name || 'Verified Specialist',
      specialty: doc.specialty || specialty,
      hospital: doc.hospital || 'Sushruth Partner Network',
      consultationFee: doc.consultationFee || 500,
      rating: doc.rating || 4.9,
    }));

    let conv;
    if (conversationId) {
      conv = await AiConversation.findOne({ _id: conversationId, user: req.user._id });
    }

    if (!conv) {
      const generatedTitle = prompt.length > 38 ? prompt.slice(0, 35) + '...' : prompt;
      conv = new AiConversation({
        user: req.user._id,
        title: generatedTitle,
        messages: [],
      });
    }

    // Append user message
    conv.messages.push({
      role: 'user',
      text: prompt.trim(),
    });

    // Append assistant reply
    conv.messages.push({
      role: 'assistant',
      text: assessment,
      recommendedSpecialty: specialty,
      suggestedDoctors,
    });

    conv.lastMessage = prompt.trim();
    await conv.save();

    res.json({
      success: true,
      conversationId: conv._id,
      title: conv.title,
      messages: conv.messages,
      latestReply: conv.messages[conv.messages.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete an AI conversation
 * @route DELETE /api/ai/conversations/:id
 */
const deleteAiConversation = async (req, res, next) => {
  try {
    const deleted = await AiConversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAiConversations,
  getAiConversationById,
  sendAiMessage,
  deleteAiConversation,
};
