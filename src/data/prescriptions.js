import { doctorPhotos } from './assets';

export const prescriptions = [
  {
    id: 'rx001', doctorName: 'Dr. Arvind Rao', initials: 'AR', specialty: 'Neurology',
    photo: doctorPhotos.arvind, hospital: 'Apollo Hospital, Hyderabad',
    date: 'Jun 1, 2026', diagnosis: 'Migraine with aura',
    followUp: 'Jun 15, 2026', status: 'Active',
    notes: 'Patient reports 3-4 episodes per week. Avoid bright screens before bed. Maintain headache diary.',
    medications: [
      { name: 'Amitriptyline', dosage: '10mg', frequency: 'Once daily (night)', duration: '30 days', type: 'Preventive' },
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed (max 2/day)', duration: 'PRN', type: 'Acute Relief' },
      { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '30 days', type: 'Preventive' },
    ],
  },
  {
    id: 'rx002', doctorName: 'Dr. Priya Mehta', initials: 'PM', specialty: 'Cardiology',
    photo: doctorPhotos.priya, hospital: 'Fortis Hospital, Mumbai',
    date: 'May 20, 2026', diagnosis: 'Essential Hypertension — Stage 1',
    followUp: 'Jun 20, 2026', status: 'Active',
    notes: 'BP consistently 140/90. Reduce salt intake to < 5g/day. Walk 30 min daily. Recheck lipid panel in 3 months.',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', duration: '90 days', type: 'Antihypertensive' },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily (night)', duration: '90 days', type: 'Statin' },
    ],
  },
  {
    id: 'rx003', doctorName: 'Dr. Rajesh Kumar', initials: 'RK', specialty: 'General Physician',
    photo: doctorPhotos.rajesh, hospital: 'City Hospital, Delhi',
    date: 'May 5, 2026', diagnosis: 'Seasonal allergic rhinitis',
    followUp: 'As needed', status: 'Completed',
    notes: 'Triggered by pollen. Avoid dust exposure. Use N95 mask outdoors. Steam inhalation recommended.',
    medications: [
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '7 days', type: 'Antihistamine' },
      { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily (night)', duration: '14 days', type: 'Anti-leukotriene' },
      { name: 'Fluticasone Nasal Spray', dosage: '50mcg', frequency: '2 sprays each nostril daily', duration: '14 days', type: 'Corticosteroid' },
    ],
  },
  {
    id: 'rx004', doctorName: 'Dr. Ananya Krishnan', initials: 'AK', specialty: 'Psychiatry',
    photo: doctorPhotos.ananya, hospital: 'NIMHANS, Bangalore',
    date: 'Apr 18, 2026', diagnosis: 'Generalized Anxiety Disorder',
    followUp: 'May 18, 2026', status: 'Completed',
    notes: 'PHQ-9 score: 8 (mild). Practice deep breathing exercises. Consider CBT sessions. Avoid caffeine after 2 PM.',
    medications: [
      { name: 'Escitalopram', dosage: '10mg', frequency: 'Once daily (morning)', duration: '60 days', type: 'SSRI' },
      { name: 'Clonazepam', dosage: '0.25mg', frequency: 'As needed (max 1/day)', duration: 'PRN', type: 'Anxiolytic' },
    ],
  },
];

export const records = [
  { id: 'rec001', title: 'Complete Blood Count (CBC)', date: 'Jun 2, 2026', type: 'Lab Report', doctor: 'Dr. Priya Mehta', hospital: 'Fortis Hospital, Mumbai', status: 'Normal', size: '1.2 MB' },
  { id: 'rec002', title: 'Lipid Profile Panel', date: 'May 18, 2026', type: 'Lab Report', doctor: 'Dr. Priya Mehta', hospital: 'Fortis Hospital, Mumbai', status: 'Borderline', size: '0.8 MB' },
  { id: 'rec003', title: 'Thyroid Panel (T3 T4 TSH)', date: 'May 10, 2026', type: 'Lab Report', doctor: 'Dr. Rajesh Kumar', hospital: 'City Hospital, Delhi', status: 'Normal', size: '0.6 MB' },
  { id: 'rec004', title: 'HbA1c — Glycated Hemoglobin', date: 'Apr 25, 2026', type: 'Lab Report', doctor: 'Dr. Rajesh Kumar', hospital: 'City Hospital, Delhi', status: 'Normal', size: '0.4 MB' },
  { id: 'rec005', title: 'ECG — 12 Lead Electrocardiogram', date: 'Apr 10, 2026', type: 'Diagnostic', doctor: 'Dr. Priya Mehta', hospital: 'Fortis Hospital, Mumbai', status: 'Normal', size: '2.1 MB' },
  { id: 'rec006', title: 'Chest X-Ray (PA View)', date: 'Mar 28, 2026', type: 'Radiology', doctor: 'Dr. Rajesh Kumar', hospital: 'City Hospital, Delhi', status: 'Normal', size: '4.5 MB' },
];

export const mriReports = [
  { id: 'mri001', title: 'Brain MRI — With Contrast (Gadolinium)', date: 'May 28, 2026', risk: 'success', summary: 'No abnormality detected', doctor: 'Dr. Arvind Rao', hospital: 'Apollo Hospital, Hyderabad', scanType: 'T1 + T2 FLAIR + DWI', slices: 142, size: '86 MB' },
  { id: 'mri002', title: 'Cervical Spine MRI — Without Contrast', date: 'Apr 15, 2026', risk: 'warning', summary: 'Mild disc bulge at C5-C6', doctor: 'Dr. Arvind Rao', hospital: 'Apollo Hospital, Hyderabad', scanType: 'T1 + T2 Sagittal', slices: 96, size: '52 MB' },
  { id: 'mri003', title: 'Brain MRI — Without Contrast', date: 'Feb 10, 2026', risk: 'success', summary: 'Normal study, no lesions', doctor: 'Dr. Arvind Rao', hospital: 'Apollo Hospital, Hyderabad', scanType: 'T2 FLAIR', slices: 120, size: '68 MB' },
];

export const familyMembers = [
  { id: 'f001', name: 'Meera Sharma', initials: 'MS', relation: 'Self', primary: true, age: 34 },
  { id: 'f002', name: 'Rohan Sharma', initials: 'RS', relation: 'Spouse', primary: false, age: 37 },
  { id: 'f003', name: 'Aanya Sharma', initials: 'AS', relation: 'Daughter', primary: false, age: 8 },
];
