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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sushruth')
.then(() => console.log('MongoDB connected for seeding...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    console.warn('⚠️ WARNING: Clearing existing data from the database...');
    
    await User.deleteMany();
    await Doctor.deleteMany();
    await Hospital.deleteMany();
    await Appointment.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    
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
      participants: [patientMeera._id, createdDoctors[0]._id]
    });

    await Message.insertMany([
      { conversationId: conv1._id, sender: patientMeera._id, senderType: 'patient', content: 'Hello Dr. Arvind, I wanted to ask about the new medication.', read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: 'Hello Meera, sure. How are you feeling after starting it?', read: true },
      { conversationId: conv1._id, sender: patientMeera._id, senderType: 'patient', content: 'A bit dizzy in the mornings.', read: true },
      { conversationId: conv1._id, sender: createdDoctors[0]._id, senderType: 'doctor', content: 'That is a common side effect for the first few days. Let us discuss more during our appointment tomorrow.', read: false }
    ]);

    // Conversation 2: Meera and Dr. Priya
    const conv2 = await Conversation.create({
      participants: [patientMeera._id, createdDoctors[1]._id]
    });

    await Message.insertMany([
      { conversationId: conv2._id, sender: patientMeera._id, senderType: 'patient', content: 'Hi Dr. Priya, I have booked a check-up for later this week.', read: false }
    ]);

    console.log('✅ Conversations and messages created.');

    console.log('🎉 Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
