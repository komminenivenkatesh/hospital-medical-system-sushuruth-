// Reliable remote imagery (pravatar for people, Unsplash for scenes).
// All <SmartImage> usages fall back to a tinted gradient if the network fails.

export const avatar = (n) => `https://i.pravatar.cc/160?img=${n}`;

// Color portrait headshots (randomuser.me) — matched by gender for realism.
const man = (n) => `https://randomuser.me/api/portraits/men/${n}.jpg`;
const woman = (n) => `https://randomuser.me/api/portraits/women/${n}.jpg`;

export const doctorPhotos = {
  arvind: man(32),
  priya: woman(44),
  rajesh: man(52),
  ananya: woman(68),
  farhan: man(75),
  sneha: woman(90),
};

export const patientPhotos = {
  john: man(11),
  pedro: man(19),
  meera: woman(65),
  rohan: man(3),
  aanya: woman(12),
};

// Feature / hero / article scenes (Unsplash CDN, sized + cropped).
const u = (id, w = 600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const scenes = {
  brain: u('photo-1559757148-5c350d0d3c56'),           // neuro / brain abstract
  heart: u('photo-1628348070889-cb656235b4eb'),         // cardio
  doctorHero: u('photo-1612349317150-e413f6a5b16d'),    // female doctor
  lab: u('photo-1579154204601-01588f351e67'),           // lab
  wellness: u('photo-1571019613454-1cb2f99b2d8b'),      // wellness/exercise
  nutrition: u('photo-1490645935967-10de6ba17061'),     // healthy food
  article1: u('photo-1505751172876-fa1923c5c528'),      // stethoscope
  article2: u('photo-1532938911079-1b06ac7ceec7'),      // mind/health
  article3: u('photo-1576091160399-112ba8d25d1d'),      // medical
};
