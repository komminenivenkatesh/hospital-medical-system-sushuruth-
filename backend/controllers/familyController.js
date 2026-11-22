const FamilyMember = require('../models/FamilyMember');

/**
 * @desc    Get all family members for logged-in user
 * @route   GET /api/family
 * @access  Private
 */
const getFamilyMembers = async (req, res, next) => {
  try {
    const members = await FamilyMember.find({ user: req.user._id }).sort({ primary: -1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new family member
 * @route   POST /api/family
 * @access  Private
 */
const addFamilyMember = async (req, res, next) => {
  try {
    const { name, relation, age, gender, bloodGroup, allergies, conditions, primary, emergencyContact } = req.body;

    if (!name || !relation || age === undefined) {
      return res.status(400).json({ message: 'Name, relation, and age are required' });
    }

    // If marked primary, unset other primaries
    if (primary) {
      await FamilyMember.updateMany({ user: req.user._id }, { primary: false });
    }

    const member = await FamilyMember.create({
      user: req.user._id,
      name,
      relation,
      age: Number(age),
      gender: gender || 'Female',
      bloodGroup: bloodGroup || 'O+',
      allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
      conditions: Array.isArray(conditions) ? conditions : (conditions ? [conditions] : []),
      primary: Boolean(primary),
      emergencyContact: emergencyContact || '',
    });

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update family member
 * @route   PUT /api/family/:id
 * @access  Private
 */
const updateFamilyMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, user: req.user._id });
    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    if (req.body.primary) {
      await FamilyMember.updateMany({ user: req.user._id }, { primary: false });
    }

    const updated = await FamilyMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete family member
 * @route   DELETE /api/family/:id
 * @access  Private
 */
const deleteFamilyMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }
    res.json({ message: 'Family member deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
};
