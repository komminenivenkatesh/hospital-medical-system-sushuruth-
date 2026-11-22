const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Load models
// Adjust paths to your actual model files if necessary
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const Appointment = require('./models/Appointment');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const Prescription = require('./models/Prescription');
const LabReport = require('./models/LabReport');
const Transaction = require('./models/Transaction');
const FamilyMember = require('./models/FamilyMember');
const Article = require('./models/Article');

// Connect to MongoDB only when run directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sushruth')
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

const seedDatabase = async () => {
  try {
    console.warn('⚠️ WARNING: Clearing existing data from the database...');
    
    await User.deleteMany();
    await Doctor.deleteMany();
    await Hospital.deleteMany();
    await Appointment.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    await Prescription.deleteMany();
    await LabReport.deleteMany();
    await Transaction.deleteMany();
    await FamilyMember.deleteMany();
    await Article.deleteMany();
    
    console.log('✅ Existing data cleared.');

    console.log('⏳ Creating users...');

    // Create Patient
    const patientMeera = await User.create({
      name: 'Meera Sharma',
      email: 'meera@example.com',
      password: 'password123', // Assuming a pre-save hook in User model hashes this
      role: 'patient',
      plan: 'free',
      phone: '+91 98765 43210'
    });

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@neurocare.com',
      password: 'password123',
      role: 'admin'
    });

    // Create Doctors (Users)
    const docData = [
      { name: 'Dr. Arvind Rao', email: 'arvind@example.com', password: 'password123', role: 'doctor' },
      { name: 'Dr. Priya Mehta', email: 'priya@example.com', password: 'password123', role: 'doctor' },
      { name: 'Dr. Rajesh Kumar', email: 'rajesh@example.com', password: 'password123', role: 'doctor' },
      { name: 'Dr. Ananya Krishnan', email: 'ananya@example.com', password: 'password123', role: 'doctor' },
      { name: 'Dr. Mohammed Farhan', email: 'farhan@example.com', password: 'password123', role: 'doctor' },
      { name: 'Dr. Sneha Reddy', email: 'sneha@example.com', password: 'password123', role: 'doctor' }
    ];

    const createdDoctors = [];
    for (const data of docData) {
      createdDoctors.push(await User.create(data));
    }

    console.log('✅ Users created.');

    console.log('⏳ Creating doctor profiles...');

    const doctorProfiles = [
      { user: createdDoctors[0]._id, specialty: 'Neurology', experienceYears: 12, rating: 4.8, consultationFee: 600, availableToday: true, status: 'Available', verificationStatus: 'Approved', licenseNumber: 'MCI-2012-4011', hospital: 'Apollo Hospital, Hyderabad' },
      { user: createdDoctors[1]._id, specialty: 'Cardiology', experienceYears: 8, rating: 4.9, consultationFee: 700, availableToday: true, status: 'Available', verificationStatus: 'Approved', licenseNumber: 'MCI-2016-8922', hospital: 'Fortis Hospital, Mumbai' },
      { user: createdDoctors[2]._id, specialty: 'General Physician', experienceYears: 15, rating: 4.6, consultationFee: 200, availableToday: true, status: 'Available', verificationStatus: 'Approved', licenseNumber: 'MCI-2009-1234', hospital: 'City Hospital, Delhi' },
      { user: createdDoctors[3]._id, specialty: 'Psychiatry', experienceYears: 10, rating: 4.9, consultationFee: 500, availableToday: false, status: 'Offline', verificationStatus: 'Approved', licenseNumber: 'MCI-2014-5544', hospital: 'NIMHANS, Bangalore' },
      { user: createdDoctors[4]._id, specialty: 'Dermatology', experienceYears: 6, rating: 4.5, consultationFee: 400, availableToday: true, status: 'Available', verificationStatus: 'Approved', licenseNumber: 'MCI-2018-9901', hospital: 'Skin Care Clinic, Hyderabad' },
      { user: createdDoctors[5]._id, specialty: 'Pediatrician', experienceYears: 9, rating: 4.7, consultationFee: 450, availableToday: true, status: 'Available', verificationStatus: 'Approved', licenseNumber: 'MCI-2015-3321', hospital: "Rainbow Children's Hospital" }
    ];

    const createdDocProfiles = await Doctor.insertMany(doctorProfiles);
    
    console.log('✅ Doctor profiles created.');

    console.log('⏳ Creating hospital profiles...');

    // Hospital Admin User
    const hospitalAdmin = await User.create({
      name: 'Apollo Medical Administration',
      email: 'admin@apollohyderabad.com',
      password: 'password123',
      role: 'hospital',
      phone: '+91 40 2360 7777'
    });

    const hospitalCareAdmin = await User.create({
      name: 'Care Hospital Operations',
      email: 'admin@carehospitals.com',
      password: 'password123',
      role: 'hospital',
      phone: '+91 40 6165 6565'
    });

    const sampleHospitals = [
      {
        user: hospitalAdmin._id,
        name: 'Apollo Hospitals, Jubilee Hills',
        type: 'Multi-Specialty',
        licenseNumber: 'CEA-TS-2015-0812',
        city: 'Hyderabad, Telangana',
        address: 'Road No 72, Film Nagar, Jubilee Hills',
        totalBeds: 350,
        availableBeds: 42,
        facilities: ['24/7 Emergency', 'ICU Facilities', 'Advanced MRI', 'In-house Pharmacy', 'Blood Bank', 'Ambulance'],
        rating: 4.8,
        reviews: '2.4k',
        price: '₹120',
        waitMinutes: 15,
        verificationStatus: 'Approved'
      },
      {
        user: hospitalCareAdmin._id,
        name: 'Care Super Specialty Hospital',
        type: 'Super-Specialty',
        licenseNumber: 'CEA-TS-2024-9102',
        city: 'Banjara Hills, Hyderabad',
        address: 'Road No 1, Banjara Hills',
        totalBeds: 220,
        availableBeds: 28,
        facilities: ['24/7 Emergency', 'ICU Facilities', 'Cath Lab', 'Blood Bank'],
        rating: 4.6,
        reviews: '950',
        price: '₹100',
        waitMinutes: 20,
        verificationStatus: 'Pending'
      }
    ];

    await Hospital.insertMany(sampleHospitals);
    console.log('✅ Hospital profiles created.');

    console.log('⏳ Creating appointments...');

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);

    const in5Days = new Date(now);
    in5Days.setDate(in5Days.getDate() + 5);

    const appointmentsData = [
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[0]._id,
        type: 'video',
        date: tomorrow,
        slot: '2:30 PM',
        reason: 'Follow-up migraine consultation',
        status: 'confirmed'
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[1]._id,
        type: 'in-person',
        date: in3Days,
        slot: '11:00 AM',
        reason: 'Routine cardiac check-up',
        status: 'pending'
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[2]._id,
        type: 'video',
        date: in5Days,
        slot: '4:00 PM',
        reason: 'General health check-up',
        status: 'pending'
      }
    ];

    await Appointment.insertMany(appointmentsData);

    console.log('✅ Appointments created.');

    console.log('⏳ Creating conversations and messages...');

    // Conversation 1: Meera and Dr. Arvind
    const conv1 = await Conversation.create({
      participants: [patientMeera._id, createdDoctors[0]._id],
      lastMessage: 'hey hi'
    });

    await Message.insertMany([
      { conversationId: conv1._id, sender: patientMeera._id, senderType: 'patient', content: "Dr. Rao, I've been having headaches again since yesterday.", read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: "Hello Meera, I'm sorry to hear that. Are the headaches similar to before, or different in character?", read: true },
      { conversationId: conv1._id, sender: patientMeera._id, senderType: 'patient', content: "Similar, but the aura lasts a bit longer this time.", read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: "Thank you for the detail. Continue the Amitriptyline and let's review in our next session. If it worsens, please use the Sumatriptan as discussed.", read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: "💊 Take prescribed dose with food and water.", read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: "hey hi", read: true }
    ]);

    // Conversation 2: Meera and Dr. Priya
    const conv2 = await Conversation.create({
      participants: [patientMeera._id, createdDoctors[1]._id]
    });

    await Message.insertMany([
      { conversationId: conv2._id, sender: patientMeera._id, senderType: 'patient', content: 'Hi Dr. Priya, I have booked a check-up for later this week.', read: false }
    ]);

    console.log('✅ Conversations and messages created.');

    console.log('⏳ Creating prescriptions and lab reports...');

    await Prescription.insertMany([
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[0]._id, // Dr. Arvind Rao
        diagnosis: 'Migraine with aura',
        status: 'Active',
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: 'Patient reports 3-4 episodes per week. Avoid bright screens before bed. Maintain headache diary.',
        advice: 'Drink at least 2.5L water daily. Regular aerobic exercise.',
        medicines: [
          { name: 'Amitriptyline', dosage: '10mg', frequency: 'Once daily (night)', duration: '30 days', instructions: 'Take after dinner' },
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed (max 2/day)', duration: 'PRN', instructions: 'Take at onset of aura' },
          { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Monitor resting pulse' },
        ],
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[1]._id, // Dr. Priya Mehta
        diagnosis: 'Essential Hypertension — Stage 1',
        status: 'Active',
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: 'BP consistently 140/90. Reduce sodium intake. Walk 30 min daily.',
        advice: 'Maintain daily BP log. Avoid excessive caffeine.',
        medicines: [
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', duration: '90 days', instructions: 'Take with or without food' },
          { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily (night)', duration: '90 days', instructions: 'Take at bedtime' },
        ],
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[2]._id, // Dr. Rajesh Kumar
        diagnosis: 'Seasonal allergic rhinitis',
        status: 'Completed',
        notes: 'Triggered by pollen. Steam inhalation recommended.',
        medicines: [
          { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '7 days', instructions: 'Take in the evening' },
          { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily (night)', duration: '14 days', instructions: 'Take before sleep' },
        ],
      },
    ]);

    await LabReport.insertMany([
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[1]._id,
        testName: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        resultStatus: 'Normal',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        parameters: [
          { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', referenceRange: '12.0 - 15.5', status: 'Normal' },
          { name: 'WBC Count', value: '7,200', unit: '/mcL', referenceRange: '4,500 - 11,000', status: 'Normal' },
          { name: 'Platelets', value: '245,000', unit: '/mcL', referenceRange: '150,000 - 450,000', status: 'Normal' },
          { name: 'RBC Count', value: '4.6', unit: 'million/mcL', referenceRange: '4.0 - 5.2', status: 'Normal' },
        ],
        notes: 'All hematological parameters within healthy physiological limits.',
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[1]._id,
        testName: 'Lipid Profile Panel',
        category: 'Biochemistry',
        resultStatus: 'Borderline',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        parameters: [
          { name: 'Total Cholesterol', value: '208', unit: 'mg/dL', referenceRange: '< 200', status: 'Borderline' },
          { name: 'HDL (Good)', value: '54', unit: 'mg/dL', referenceRange: '> 50', status: 'Normal' },
          { name: 'LDL (Bad)', value: '132', unit: 'mg/dL', referenceRange: '< 100', status: 'Borderline' },
          { name: 'Triglycerides', value: '145', unit: 'mg/dL', referenceRange: '< 150', status: 'Normal' },
        ],
        notes: 'Slightly elevated LDL and Total Cholesterol. Dietary lifestyle changes recommended.',
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[2]._id,
        testName: 'Thyroid Panel (T3, T4, TSH)',
        category: 'Endocrinology',
        resultStatus: 'Normal',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        parameters: [
          { name: 'TSH', value: '2.1', unit: 'uIU/mL', referenceRange: '0.4 - 4.0', status: 'Normal' },
          { name: 'Free T3', value: '3.2', unit: 'pg/mL', referenceRange: '2.0 - 4.4', status: 'Normal' },
          { name: 'Free T4', value: '1.2', unit: 'ng/dL', referenceRange: '0.8 - 1.8', status: 'Normal' },
        ],
        notes: 'Euthyroid state confirmed. Normal thyroid function.',
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[2]._id,
        testName: 'HbA1c — Glycated Hemoglobin',
        category: 'Diabetes Care',
        resultStatus: 'Normal',
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        parameters: [
          { name: 'HbA1c', value: '5.4', unit: '%', referenceRange: '< 5.7', status: 'Normal' },
          { name: 'Estimated Avg Glucose', value: '108', unit: 'mg/dL', referenceRange: '< 117', status: 'Normal' },
        ],
        notes: 'Non-diabetic range.',
      },
    ]);

    console.log('✅ Prescriptions and lab reports created.');

    console.log('⏳ Creating transactions...');
    await Transaction.create([
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[0]._id,
        title: 'Video Consultation Fee',
        amount: 600,
        type: 'Video Consultation',
        specialty: 'Neurology',
        status: 'Completed',
        method: 'UPI',
        methodDetails: 'meera@okicici',
        doctorGross: 600,
        platformCommission: 90,
        tds: 30,
        doctorNet: 480,
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[1]._id,
        title: 'Cardiology In-Clinic Consultation',
        amount: 900,
        type: 'In-Clinic Visit',
        specialty: 'Cardiology',
        status: 'Completed',
        method: 'Card',
        methodDetails: '•••• •••• •••• 4523',
        doctorGross: 900,
        platformCommission: 135,
        tds: 45,
        doctorNet: 720,
      },
      {
        patient: patientMeera._id,
        title: 'Sushruth Pro Health Membership',
        amount: 299,
        type: 'Monthly Plan',
        specialty: 'Platform Subscription',
        status: 'Auto-renewed',
        method: 'UPI',
        methodDetails: 'meera@okicici',
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[2]._id,
        title: 'General Physician Teleconsult',
        amount: 200,
        type: 'Video Consultation',
        specialty: 'General Medicine',
        status: 'Completed',
        method: 'Wallet',
        methodDetails: 'Sushruth Wallet',
        doctorGross: 200,
        platformCommission: 30,
        tds: 10,
        doctorNet: 160,
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[5]._id,
        title: 'Pediatrics Consultation',
        amount: 600,
        type: 'In-Clinic Visit',
        specialty: 'Pediatrics',
        status: 'Refunded',
        method: 'Card',
        methodDetails: '•••• •••• •••• 4523',
        doctorGross: 0,
        platformCommission: 0,
        tds: 0,
        doctorNet: 0,
      },
      // Doctor Arvind Rao past earnings transactions
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[0]._id,
        title: 'Brain MRI Scan Review & Report',
        amount: 500,
        type: 'MRI Review',
        specialty: 'Neurology',
        status: 'Completed',
        method: 'UPI',
        doctorGross: 500,
        platformCommission: 75,
        tds: 25,
        doctorNet: 400,
      },
      {
        patient: patientMeera._id,
        doctor: createdDocProfiles[0]._id,
        title: 'Follow-up Neurology Teleconsult',
        amount: 600,
        type: 'Video Consultation',
        specialty: 'Neurology',
        status: 'Completed',
        method: 'UPI',
        doctorGross: 600,
        platformCommission: 90,
        tds: 30,
        doctorNet: 480,
      },
    ]);
    console.log('✅ Transactions seeded.');

    console.log('⏳ Creating family members...');
    await FamilyMember.create([
      {
        user: patientMeera._id,
        name: 'Meera Sharma',
        relation: 'Self',
        age: 34,
        gender: 'Female',
        bloodGroup: 'O+',
        primary: true,
        allergies: ['Penicillin (mild)'],
        conditions: ['Migraine with aura'],
        emergencyContact: '+91 98765 43210',
      },
      {
        user: patientMeera._id,
        name: 'Rohan Sharma',
        relation: 'Spouse',
        age: 37,
        gender: 'Male',
        bloodGroup: 'B+',
        primary: false,
        allergies: ['Sulfa Drugs'],
        conditions: ['Mild Hypertension'],
        emergencyContact: '+91 98765 43211',
      },
      {
        user: patientMeera._id,
        name: 'Aarav Sharma',
        relation: 'Child',
        age: 8,
        gender: 'Male',
        bloodGroup: 'O+',
        primary: false,
        allergies: ['Peanuts'],
        conditions: [],
        emergencyContact: '+91 98765 43210',
      },
      {
        user: patientMeera._id,
        name: 'Sunita Sharma',
        relation: 'Parent',
        age: 62,
        gender: 'Female',
        bloodGroup: 'A+',
        primary: false,
        allergies: [],
        conditions: ['Type 2 Diabetes', 'Osteoarthritis'],
        emergencyContact: '+91 98765 43210',
      },
    ]);
    console.log('✅ Family members seeded.');

    console.log('⏳ Creating health articles...');
    await Article.create([
      {
        title: "Unlock Your Brain's Full Potential with Better Sleep",
        category: 'Wellness',
        tag: 'Wellness',
        subTags: ['Brain Health', 'Circadian Rhythm', 'Sleep Science'],
        readTime: '5 min read',
        author: {
          name: 'Dr. Arvind Rao',
          role: 'Lead Neurologist · Fortis Hospital',
          avatar: '',
        },
        desc: 'A deep dive into how circadian rhythms and deep sleep phases directly impact your cognitive performance, memory retention, and overall mental health.',
        paragraph1: 'Quality sleep is the fundamental foundation of neurological resilience. During deep NREM and REM stages, the brain activates the glymphatic system—clearing out toxic metabolic waste products including beta-amyloid proteins that accumulate throughout waking hours.',
        pullQuote: 'Deep sleep is not downtime; it is your brain’s active restoration window.',
        paragraph2: 'Optimizing sleep starts with consistent light exposure: natural sunlight within 30 minutes of waking suppresses melatonin and resets your master circadian clock in the suprachiasmatic nucleus. In the evening, dimming artificial blue light signals natural melatonin secretion.',
        img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        views: 2840,
        likes: 312,
      },
      {
        title: 'Discover the Hidden Gems: New Migraine Treatments',
        category: 'Neurology',
        tag: 'Neurology',
        subTags: ['Migraine', 'CGRP Inhibitors', 'Headache Care'],
        readTime: '4 min read',
        author: {
          name: 'Dr. Priya Mehta',
          role: 'Cardiologist & General Physician',
          avatar: '',
        },
        desc: 'Beyond standard painkillers: explore targeted CGRP monoclonal antibodies, gepants, and neuromodulation devices that are revolutionizing migraine management.',
        paragraph1: 'For decades, migraine patients had few options beyond non-specific pain relievers and triptans. Today, the medical landscape has transformed with calcitonin gene-related peptide (CGRP) pathway antagonists designed specifically for migraine prophylaxis.',
        pullQuote: 'Precision medicine has arrived for chronic headache disorders.',
        paragraph2: 'These therapies have shown remarkable efficacy in cutting monthly headache days in half for patients with chronic intractable migraines, with minimal systemic side effects.',
        img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        views: 1940,
        likes: 184,
      },
      {
        title: 'Epicurean Adventures: Diets That Will Satisfy Your Brain',
        category: 'Nutrition',
        tag: 'Nutrition',
        subTags: ['MIND Diet', 'Omega-3', 'Brain Nutrition'],
        readTime: '6 min read',
        author: {
          name: 'Dr. Rajesh Kumar',
          role: 'General Medicine Consultant',
          avatar: '',
        },
        desc: 'Explore the neuroprotective MIND diet: combining Mediterranean and DASH dietary principles to reduce neuroinflammation and preserve memory.',
        paragraph1: 'The gut-brain axis is a two-way biochemical communication highway mediated by the vagus nerve and neuroactive gut peptides. What you eat directly modulates your neuroinflammation levels and neurotransmitter synthesis.',
        pullQuote: 'Feed your microbiome to shield your cognitive reserve.',
        paragraph2: 'Rich sources of DHA and EPA omega-3 fatty acids, polyphenols from dark berries, and leafy green folate have been clinically shown to slow cognitive aging by up to 7.5 years.',
        img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        views: 1420,
        likes: 215,
      },
      {
        title: "The Science of Meditation: Rewiring Your Brain",
        category: 'Psychology',
        tag: 'Psychology',
        subTags: ['Mindfulness', 'Neuroplasticity', 'Stress Reduction'],
        readTime: '4 min read',
        author: {
          name: 'Dr. Arvind Rao',
          role: 'Neurologist',
          avatar: '',
        },
        desc: 'Discover how daily mindfulness practices can physically change your brain structure, shrinking the amygdala and thickening the prefrontal cortex.',
        paragraph1: 'Neuroimaging studies confirm that 8 weeks of consistent mindfulness practice leads to structural neuroplastic alterations. Gray matter density increases in regions associated with memory, empathy, and emotional regulation.',
        pullQuote: 'Mental training literally reshapes the neuroarchitecture of emotion.',
        paragraph2: 'Simultaneously, the amygdala—the brain’s threat detection center—demonstrates reduced hyper-reactivity, resulting in lower circulating cortisol and enhanced stress resilience.',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        views: 2100,
        likes: 340,
      },
      {
        title: 'Understanding Brain Fog: Causes and Solutions',
        category: 'Neurology',
        tag: 'Neurology',
        subTags: ['Cognition', 'Thyroid', 'Fatigue'],
        readTime: '5 min read',
        author: {
          name: 'Dr. Ananya Krishnan',
          role: 'Clinical Specialist',
          avatar: '',
        },
        desc: 'Struggling to concentrate or find words? Learn the biological root causes of brain fog—from subclinical thyroid dysfunction to sleep disruption—and how to fix them.',
        paragraph1: 'Brain fog is not a medical diagnosis; it is a clinical symptom complex indicating metabolic or inflammatory stress on neuronal synapses. Common drivers include post-viral fatigue, micronutrient deficiencies (B12, Vitamin D, Ferritin), and chronic sleep fragmentation.',
        pullQuote: 'Brain fog is a distress signal, not a character flaw.',
        paragraph2: 'A comprehensive biochemical workup including fasting glucose, HbA1c, thyroid panel, and inflammatory markers often uncovers reversible underlying metabolic bottlenecks.',
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        views: 1780,
        likes: 198,
      },
    ]);
    console.log('✅ Health articles seeded.');

    console.log('🎉 Database seeded successfully!');
    if (require.main === module) {
      process.exit(0);
    }
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('❌ Error with database seeding:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sushruth')
  .then(() => {
    console.log('MongoDB connected for seeding...');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
