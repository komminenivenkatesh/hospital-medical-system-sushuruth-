import { doctorPhotos } from './assets';

export const patient = {
  id: 'u001', name: 'Meera Sharma', initials: 'MS', phone: '+91 98765 43210',
  city: 'Pune', state: 'Maharashtra', dob: '1992-03-15', age: 34, gender: 'Female', plan: 'free',
  appointmentsThisMonth: 2, appointmentLimit: 3, activePrescriptions: 4, mriReports: 0,
  email: 'meera.sharma@gmail.com', bloodGroup: 'B+',
};

export const nextAppointment = {
  id: 'a001', doctorId: 'd001', doctorName: 'Dr. Arvind Rao', initials: 'AR',
  specialty: 'Neurology', date: '2026-06-10', time: '14:30', mode: 'Video', status: 'Upcoming',
};

export const schedule = [
  { id: 's001', type: 'appointment', title: "Doctor's appointment", subtitle: 'Dr. Arvind Rao', doctor: 'Dr. Arvind Rao', time: '8:00 AM – 10:00 AM (IST)', date: '2026-06-10', chipLabel: 'Appointment', chipColor: 'primary' },
  { id: 's002', type: 'exercise', title: 'Daily exercise', subtitle: 'Exercise for brain activity', time: '12:00 PM – 1:00 PM', date: '2026-06-10', chipLabel: 'Exercise', chipColor: 'success' },
  { id: 's003', type: 'appointment', title: 'Family Doctor', subtitle: 'Dr. Priya Mehta', doctor: 'Dr. Priya Mehta', time: '2:30 PM – 3:30 PM (IST)', date: '2026-06-12', chipLabel: 'Appointment', chipColor: 'primary' },
];

export const weekSchedule = [
  { day: 'Tue 10', doctor: 'Dr. Arvind Rao', time: '14:30', type: 'Video' },
  { day: 'Thu 12', doctor: 'Dr. Priya Mehta', time: '11:00', type: 'In-Clinic' },
  { day: 'Sat 14', doctor: 'Dr. Rajesh Kumar', time: '16:00', type: 'Video' },
];

export const appointments = [
  {
    id: 'a001', doctorId: 'd001', doctorName: 'Dr. Arvind Rao', specialty: 'Neurology',
    date: '2026-06-10', time: '14:30', mode: 'Video', status: 'Upcoming',
    photo: doctorPhotos.arvind, hospital: 'Apollo Hospital, Hyderabad',
    reason: 'Follow-up migraine consultation', fee: 600, duration: '30 min',
    notes: 'Bring previous MRI reports. Continue Amitriptyline 10mg.',
  },
  {
    id: 'a002', doctorId: 'd002', doctorName: 'Dr. Priya Mehta', specialty: 'Cardiology',
    date: '2026-06-12', time: '11:00', mode: 'In-Clinic', status: 'Upcoming',
    photo: doctorPhotos.priya, hospital: 'Fortis Hospital, Mumbai',
    reason: 'Routine cardiac check-up', fee: 900, duration: '45 min',
    notes: 'Fasting required for blood work. Carry insurance card.',
  },
  {
    id: 'a003', doctorId: 'd003', doctorName: 'Dr. Rajesh Kumar', specialty: 'General Physician',
    date: '2026-06-14', time: '16:00', mode: 'Video', status: 'Upcoming',
    photo: doctorPhotos.rajesh, hospital: 'City Hospital, Pune',
    reason: 'General health check-up', fee: 200, duration: '20 min',
    notes: 'Annual wellness review.',
  },
  {
    id: 'a004', doctorId: 'd001', doctorName: 'Dr. Arvind Rao', specialty: 'Neurology',
    date: '2026-05-28', time: '10:00', mode: 'Video', status: 'Completed',
    photo: doctorPhotos.arvind, hospital: 'Apollo Hospital, Hyderabad',
    reason: 'MRI report review', fee: 600, duration: '30 min',
    notes: 'MRI results discussed. No abnormalities found.',
  },
  {
    id: 'a005', doctorId: 'd002', doctorName: 'Dr. Priya Mehta', specialty: 'Cardiology',
    date: '2026-05-15', time: '15:00', mode: 'In-Clinic', status: 'Completed',
    photo: doctorPhotos.priya, hospital: 'Fortis Hospital, Mumbai',
    reason: 'ECG follow-up', fee: 900, duration: '45 min',
    notes: 'ECG normal. Blood pressure stable. Continue current medication.',
  },
];

export const getAppointment = (id) => appointments.find((a) => a.id === id);
