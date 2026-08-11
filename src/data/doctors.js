export const doctors = [
  { id: 'd001', name: 'Dr. Arvind Rao', initials: 'AR', specialty: 'Neurology', subSpecialty: 'Epilepsy Specialist', hospital: 'Apollo Hospital, Hyderabad', city: 'Hyderabad', experience: 12, languages: ['Hindi', 'English', 'Telugu'], inClinicFee: 800, videoFee: 600, rating: 4.8, reviews: 342, consultations: 2400, availableToday: true, nextSlot: 'Today 3:00 PM', verified: true, phone: '+91 98765 43210', mode: 'Online/Offline',
    tags: ['Epilepsy', 'Migraine', 'Stroke', 'EEG', 'Movement Disorders'],
    bio: 'Dr. Arvind Rao is a senior neurologist with over 12 years of experience in treating epilepsy, migraines, and movement disorders. He has published extensively on epilepsy management and is known for his patient-first approach.',
    education: [
      { year: '2008', title: 'MBBS', place: 'Osmania Medical College' },
      { year: '2012', title: 'MD Neurology', place: 'AIIMS, New Delhi' },
      { year: '2014', title: 'Fellowship in Epilepsy', place: 'Cleveland Clinic, USA' },
    ] },
  { id: 'd002', name: 'Dr. Priya Mehta', initials: 'PM', specialty: 'Cardiology', subSpecialty: 'Interventional Cardiology', hospital: 'Fortis Hospital, Mumbai', city: 'Mumbai', experience: 8, languages: ['Hindi', 'English', 'Marathi'], inClinicFee: 900, videoFee: 700, rating: 4.9, reviews: 521, consultations: 3100, availableToday: true, nextSlot: 'Today 4:30 PM', verified: true, phone: '+91 98200 11223', mode: 'Online/Offline',
    tags: ['Heart Disease', 'Angioplasty', 'ECG', 'Cholesterol', 'Hypertension'],
    bio: 'Dr. Priya Mehta specialises in interventional cardiology and preventive heart care, with a focus on women\'s cardiovascular health.',
    education: [
      { year: '2011', title: 'MBBS', place: 'Grant Medical College' },
      { year: '2015', title: 'DM Cardiology', place: 'KEM Hospital, Mumbai' },
    ] },
  { id: 'd003', name: 'Dr. Rajesh Kumar', initials: 'RK', specialty: 'General Physician', subSpecialty: 'Internal Medicine', hospital: 'City Hospital, Delhi', city: 'Delhi', experience: 15, languages: ['Hindi', 'English'], inClinicFee: 300, videoFee: 200, rating: 4.6, reviews: 189, consultations: 4500, availableToday: true, nextSlot: 'Today 2:00 PM', verified: true, phone: '+91 99100 55667', mode: 'Online/Offline',
    tags: ['Fever', 'Diabetes', 'Thyroid', 'General Checkup', 'Infections'],
    bio: 'Dr. Rajesh Kumar is a trusted family physician with 15 years of community practice in Delhi.',
    education: [ { year: '2005', title: 'MBBS', place: 'Maulana Azad Medical College' }, { year: '2009', title: 'MD General Medicine', place: 'AIIMS, New Delhi' } ] },
  { id: 'd004', name: 'Dr. Ananya Krishnan', initials: 'AK', specialty: 'Psychiatry', subSpecialty: 'Mood Disorders', hospital: 'NIMHANS, Bangalore', city: 'Bangalore', experience: 10, languages: ['English', 'Kannada', 'Tamil'], inClinicFee: 700, videoFee: 500, rating: 4.9, reviews: 156, consultations: 1200, availableToday: false, nextSlot: 'Tomorrow 10:00 AM', verified: true, phone: '+91 90080 33445', mode: 'Offline',
    tags: ['Depression', 'Anxiety', 'PTSD', 'CBT', 'Bipolar Disorder', 'OCD'],
    bio: 'Dr. Ananya Krishnan focuses on mood disorders, anxiety, and cognitive behavioural therapy.',
    education: [ { year: '2009', title: 'MBBS', place: 'St John\'s Medical College' }, { year: '2013', title: 'MD Psychiatry', place: 'NIMHANS, Bangalore' } ] },
  { id: 'd005', name: 'Dr. Mohammed Farhan', initials: 'MF', specialty: 'Dermatology', subSpecialty: 'Cosmetic Dermatology', hospital: 'Skin Care Clinic, Hyderabad', city: 'Hyderabad', experience: 6, languages: ['Hindi', 'English', 'Urdu'], inClinicFee: 500, videoFee: 400, rating: 4.5, reviews: 98, consultations: 800, availableToday: true, nextSlot: 'Today 11:30 AM', verified: true, phone: '+91 91234 77889', mode: 'Online',
    tags: ['Acne', 'Pigmentation', 'Hair Loss', 'Skin Allergy', 'Laser Treatment'],
    bio: 'Dr. Mohammed Farhan is a dermatologist specialising in acne, pigmentation, and cosmetic skin treatments.',
    education: [ { year: '2013', title: 'MBBS', place: 'Deccan College of Medical Sciences' }, { year: '2017', title: 'MD Dermatology', place: 'Gandhi Medical College' } ] },
  { id: 'd006', name: 'Dr. Sneha Reddy', initials: 'SR', specialty: 'Pediatrician', subSpecialty: 'Neonatology', hospital: 'Rainbow Children\'s Hospital, Hyderabad', city: 'Hyderabad', experience: 9, languages: ['Telugu', 'English', 'Hindi'], inClinicFee: 600, videoFee: 450, rating: 4.7, reviews: 233, consultations: 1900, availableToday: true, nextSlot: 'Today 1:00 PM', verified: true, phone: '+91 93920 22110', mode: 'Online/Offline',
    tags: ['Newborn Care', 'Vaccination', 'Growth Issues', 'Child Nutrition', 'Asthma'],
    bio: 'Dr. Sneha Reddy is a pediatrician and neonatologist with a gentle approach to childcare.',
    education: [ { year: '2010', title: 'MBBS', place: 'Kakatiya Medical College' }, { year: '2014', title: 'MD Pediatrics', place: 'NIMS, Hyderabad' } ] },
];

import { doctorPhotos } from './assets';

const photoById = {
  d001: doctorPhotos.arvind, d002: doctorPhotos.priya, d003: doctorPhotos.rajesh,
  d004: doctorPhotos.ananya, d005: doctorPhotos.farhan, d006: doctorPhotos.sneha,
};
doctors.forEach((d) => { d.photo = photoById[d.id]; });

export const specialties = ['All', 'Neurologist', 'Cardiologist', 'General Physician', 'Pediatrician', 'Dermatologist', 'Orthopedic', 'Psychiatrist'];

export const getDoctor = (id) => doctors.find((d) => d.id === id);
