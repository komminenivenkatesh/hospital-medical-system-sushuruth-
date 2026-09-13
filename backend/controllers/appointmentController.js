const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const bookAppointment = async (req, res, next) => {
  try {
    const { doctor, type, date, slot, reason, shareHistory } = req.body;
    const patient = req.user._id;

    const conflict = await Appointment.findOne({
      doctor,
      date,
      slot,
      status: { $ne: 'cancelled' }
    });

    if (conflict) {
      return res.status(400).json({ message: 'This slot is already booked for this doctor' });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      type,
      date,
      slot,
      reason,
      shareHistory
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      filter.doctor = doctorProfile._id;
    } else {
       return res.status(403).json({ message: 'Not authorized' });
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: -1 })
      .populate('patient', 'name email avatar')
      .populate({
        path: 'doctor',
        select: 'specialty user',
        populate: { path: 'user', select: 'name' }
      });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus
};
