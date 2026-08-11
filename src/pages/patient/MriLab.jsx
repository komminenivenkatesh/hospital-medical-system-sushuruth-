import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Grid, LinearProgress,
  Alert, Stack, Avatar, IconButton, Divider, Tabs, Tab, Tooltip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import useStore from '../../store/useStore';
import { tokens } from '../../theme/theme';
import { scenes, doctorPhotos } from '../../data/assets';
import { patient } from '../../data/appointments';

const scanHistory = [
  {
    id: 's1', date: 'June 3, 2026', type: 'Brain MRI', status: 'Reviewed',
    findings: 'No abnormalities detected. Normal brain parenchyma with no evidence of mass lesion, hemorrhage, or acute infarction. Ventricles and sulci are normal in size.',
    doctor: 'Dr. Arvind Rao', doctorPhoto: doctorPhotos.arvind, specialty: 'Neurologist',
    confidence: 94, risk: 'Low', severity: 2,
    details: [
      { label: 'Gray matter', value: 'Normal', status: 'ok' },
      { label: 'White matter', value: 'No lesions', status: 'ok' },
      { label: 'Ventricles', value: 'Normal size', status: 'ok' },
      { label: 'Midline shift', value: 'None', status: 'ok' },
    ],
  },
  {
    id: 's2', date: 'May 15, 2026', type: 'X-Ray Chest', status: 'Reviewed',
    findings: 'Heart size appears normal. No pleural effusion. Lung fields are clear. No consolidation or pneumothorax observed.',
    doctor: 'Dr. Priya Mehta', doctorPhoto: doctorPhotos.priya, specialty: 'Cardiologist',
    confidence: 97, risk: 'Low', severity: 1,
    details: [
      { label: 'Heart size', value: 'Normal', status: 'ok' },
      { label: 'Lung fields', value: 'Clear', status: 'ok' },
      { label: 'Pleural space', value: 'No effusion', status: 'ok' },
      { label: 'Mediastinum', value: 'Normal', status: 'ok' },
    ],
  },
  {
    id: 's3', date: 'April 28, 2026', type: 'Blood Report', status: 'Reviewed',
    findings: 'CRP slightly elevated at 1.8 mg/L. All other markers within normal range. WBC, RBC, and platelet counts normal.',
    doctor: 'Dr. Rajesh Kumar', doctorPhoto: doctorPhotos.rajesh, specialty: 'General Physician',
    confidence: 99, risk: 'Medium', severity: 4,
    details: [
      { label: 'CRP', value: '1.8 mg/L', status: 'warn' },
      { label: 'WBC', value: '8,500/μL', status: 'ok' },
      { label: 'ESR', value: '12 mm/hr', status: 'ok' },
      { label: 'HGB', value: '15.1 g/dL', status: 'ok' },
    ],
  },
  {
    id: 's4', date: 'March 20, 2026', type: 'Spine MRI', status: 'Pending Review',
    findings: 'Mild disc desiccation at L4-L5. No significant disc herniation or spinal canal stenosis. Neural foramina patent bilaterally.',
    doctor: 'Dr. Arvind Rao', doctorPhoto: doctorPhotos.arvind, specialty: 'Neurologist',
    confidence: 91, risk: 'Low', severity: 3,
    details: [
      { label: 'L4-L5 disc', value: 'Mild desiccation', status: 'warn' },
      { label: 'Spinal canal', value: 'No stenosis', status: 'ok' },
      { label: 'Neural foramina', value: 'Patent', status: 'ok' },
      { label: 'Cord signal', value: 'Normal', status: 'ok' },
    ],
  },
];

const scanTypes = [
  { label: 'Brain MRI', img: scenes.brain, desc: 'Tumors, lesions, aneurysms', color: '#2563EB' },
  { label: 'Cardiac MRI', img: scenes.heart, desc: 'Heart structure & function', color: '#EF4444' },
  { label: 'X-Ray', img: scenes.article1, desc: 'Bones, chest, abdomen', color: '#059669' },
  { label: 'Blood Report', img: scenes.lab, desc: 'CBC, LFT, KFT, thyroid', color: '#7C3AED' },
  { label: 'Spine MRI', img: scenes.article3, desc: 'Disc herniation, cord', color: '#D97706' },
];

const bodyHotspots = [
  { id: 'head', label: 'Head', x: '50%', y: '8%', scanId: 's1' },
  { id: 'chest', label: 'Chest', x: '50%', y: '30%', scanId: 's2' },
  { id: 'abdomen', label: 'Abdomen', x: '50%', y: '48%', scanId: 's3' },
  { id: 'spine', label: 'Lower Back', x: '50%', y: '62%', scanId: 's4' },
];

const benefits = [
  { text: 'Tumor detection & segmentation', icon: BiotechOutlinedIcon },
  { text: '94%+ accuracy rate', icon: SpeedOutlinedIcon },
  { text: 'Doctor review & sign-off', icon: VerifiedOutlinedIcon },
  { text: 'Encrypted & HIPAA compliant', icon: SecurityOutlinedIcon },
];

function LockedView({ onUpgrade }) {
  return (
    <PageTransition>
      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 3, height: { xs: 180, md: 220 } }}>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}>
          <SmartImage src={scenes.brain} alt="MRI scan" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallbackColor="#0F172A" />
        </motion.div>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,18,32,0.92) 0%, rgba(11,18,32,0.6) 50%, transparent 100%)' }} />
        <Box sx={{ position: 'absolute', inset: 0, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Chip label="Pro Feature" size="small" sx={{ bgcolor: '#FEF6E7', color: '#B45309', fontWeight: 700, mb: 1.5, alignSelf: 'flex-start' }} />
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 34 }, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
            Medical Scan Analysis
          </Typography>
          <Typography sx={{ fontSize: { xs: 13, md: 15 }, color: 'rgba(255,255,255,0.72)', mt: 0.75, maxWidth: 380 }}>
            MRI · X-Ray · Blood Reports · AI-powered analysis reviewed by specialists
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {scanTypes.slice(0, 4).map((s, i) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ overflow: 'hidden', cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 200ms ease' }}>
              <Box sx={{ height: 100, overflow: 'hidden', position: 'relative' }}>
                <SmartImage src={s.img} alt={s.label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallbackColor={s.color} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              </Box>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{s.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: tokens.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LockOutlinedIcon sx={{ color: tokens.primary, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Unlock AI Analysis</Typography>
                  <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>Upgrade to Sushruth Pro</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, color: tokens.textSecondary, mb: 3, lineHeight: 1.65 }}>
                Upload any medical scan or report and receive comprehensive AI-powered analysis in under a minute. Every report is reviewed and signed off by a specialist.
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {benefits.map(({ text, icon: Icon }) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: tokens.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon sx={{ fontSize: 17, color: tokens.primary }} />
                    </Box>
                    <Typography sx={{ fontSize: 14 }}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
              <Button variant="contained" size="large" fullWidth sx={{ mb: 1.5, py: 1.25 }} onClick={onUpgrade}>
                Upgrade to Pro — ₹299/month
              </Button>
              <Button variant="outlined" fullWidth>View sample report</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Reviewed by specialists</Typography>
              <Stack spacing={1.5}>
                {[
                  { photo: doctorPhotos.arvind, name: 'Dr. Arvind Rao', spec: 'Neurologist · 12 yrs' },
                  { photo: doctorPhotos.priya, name: 'Dr. Priya Mehta', spec: 'Cardiologist · 10 yrs' },
                  { photo: doctorPhotos.rajesh, name: 'Dr. Rajesh Kumar', spec: 'General Physician · 15 yrs' },
                ].map((d) => (
                  <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: tokens.surfaceMuted, borderRadius: 2 }}>
                    <Avatar src={d.photo} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{d.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{d.spec}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageTransition>
  );
}

function SeverityDots({ value, max = 10 }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.3 }}>
      {Array.from({ length: max }, (_, i) => (
        <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%',
          bgcolor: i < value ? tokens.primary : tokens.border }} />
      ))}
    </Box>
  );
}

function DetailPanel({ scan, onClose }) {
  if (!scan) return null;
  const riskColor = scan.risk === 'Low' ? tokens.success : scan.risk === 'Medium' ? tokens.warning : tokens.danger;
  const riskBg = scan.risk === 'Low' ? tokens.successSoft : scan.risk === 'Medium' ? tokens.warningSoft : tokens.dangerSoft;

  return (
    <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.25 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `1px solid ${tokens.border}` }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{scan.type}</Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Findings */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${tokens.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>AI Findings</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small"><OpenInNewRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
                <IconButton size="small"><MoreHorizRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary, lineHeight: 1.6, mb: 1.5 }}>
              {scan.findings}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={scan.doctorPhoto} sx={{ width: 24, height: 24 }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{scan.doctor}</Typography>
              <Typography sx={{ fontSize: 11, color: tokens.textTertiary, ml: 'auto' }}>{scan.date}</Typography>
            </Box>
          </Box>

          {/* Detailed markers */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${tokens.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Analysis Details</Typography>
              <IconButton size="small"><MoreHorizRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
            </Box>
            <Stack spacing={1.25}>
              {scan.details.map((d) => (
                <Box key={d.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {d.status === 'ok'
                      ? <CheckCircleRoundedIcon sx={{ fontSize: 16, color: tokens.success }} />
                      : <WarningAmberRoundedIcon sx={{ fontSize: 16, color: tokens.warning }} />}
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{d.label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: d.status === 'warn' ? tokens.warning : tokens.textPrimary }}>
                    {d.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Risk + Severity */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${tokens.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Risk Level</Typography>
              <Chip label={scan.risk} size="small" sx={{ bgcolor: riskBg, color: riskColor, fontWeight: 700, fontSize: 11 }} />
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>AI Confidence</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{scan.confidence}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={scan.confidence}
                sx={{ height: 6, borderRadius: 3, bgcolor: tokens.surfaceMuted,
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: tokens.primary } }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Severity</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{scan.severity}/10</Typography>
                <SeverityDots value={scan.severity} />
              </Box>
            </Box>
          </Box>

          {/* Reviewed by */}
          <Box sx={{ px: 2.5, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar src={scan.doctorPhoto} sx={{ width: 36, height: 36 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{scan.doctor}</Typography>
                <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{scan.specialty}</Typography>
              </Box>
              <Typography sx={{ fontSize: 11, color: tokens.textTertiary, ml: 'auto' }}>{scan.date}</Typography>
            </Box>
            <Button fullWidth variant="contained" startIcon={<DownloadRoundedIcon />} sx={{ mb: 1 }}>
              Download Report
            </Button>
            <Button fullWidth variant="outlined" startIcon={<ShareRoundedIcon />}>
              Share with Doctor
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MriLab() {
  const isPro = useStore((s) => s.isPro);
  const upgrade = useStore((s) => s.upgradeToPro);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScan, setSelectedScan] = useState(scanHistory[0]);
  const [activeHotspot, setActiveHotspot] = useState('head');
  const [uploading, setUploading] = useState(false);

  if (!isPro) return <LockedView onUpgrade={upgrade} />;

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSelectedScan(scanHistory[0]);
      setActiveTab(0);
    }, 2500);
  };

  const handleHotspotClick = (hs) => {
    setActiveHotspot(hs.id);
    const scan = scanHistory.find((s) => s.id === hs.scanId);
    if (scan) setSelectedScan(scan);
  };

  return (
    <PageTransition>
      {/* Top tabs like reference */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, letterSpacing: '-0.02em' }}>
            Medical Scans
          </Typography>
          <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
            Upload, analyse, and view all your medical reports
          </Typography>
        </Box>
        <Chip label="Pro Active" sx={{ bgcolor: tokens.successSoft, color: tokens.success, fontWeight: 700 }} />
      </Box>

      <Box sx={{ bgcolor: tokens.surfaceMuted, borderRadius: 100, p: 0.5, display: 'inline-flex', gap: 0.5, mb: 2.5 }}>
        {['Diagnosis', 'Upload Scan', 'History'].map((t, i) => (
          <Box key={t} onClick={() => setActiveTab(i)}
            sx={{ px: 2.5, py: 0.9, borderRadius: 100, cursor: 'pointer',
              bgcolor: activeTab === i ? '#fff' : 'transparent',
              boxShadow: activeTab === i ? tokens.cardShadow : 'none',
              fontWeight: activeTab === i ? 700 : 500, fontSize: 13,
              color: activeTab === i ? tokens.textPrimary : tokens.textSecondary,
              transition: 'all 150ms ease' }}>
            {t}
          </Box>
        ))}
      </Box>

      {/* ───── TAB 0: Diagnosis view (like reference image) ───── */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          {/* Left: Patient info */}
          <Grid size={{ xs: 12, md: 2.5 }}>
            <Stack spacing={1.5}>
              {/* Patient card */}
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Patient</Typography>
                    <IconButton size="small"><OpenInNewRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 800 }}>
                      MS
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{patient.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{patient.gender}</Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={1}>
                    {[
                      { label: 'Age', value: '34 yrs', icon: PersonOutlineRoundedIcon },
                      { label: 'Weight', value: '58 kg', icon: PersonOutlineRoundedIcon },
                      { label: 'Height', value: '163 cm', icon: PersonOutlineRoundedIcon },
                      { label: 'Blood', value: 'B+', icon: PersonOutlineRoundedIcon },
                    ].map((f) => (
                      <Grid key={f.label} size={6}>
                        <Box sx={{ p: 1, bgcolor: tokens.surfaceMuted, borderRadius: 2, textAlign: 'center' }}>
                          <Typography sx={{ fontSize: 10, color: tokens.textTertiary, mb: 0.25 }}>{f.label}</Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{f.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Scan history list */}
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Scan History</Typography>
                    <IconButton size="small"><OpenInNewRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
                  </Box>
                  <Stack spacing={0}>
                    {scanHistory.map((s, i) => {
                      const active = selectedScan?.id === s.id;
                      return (
                        <Box key={s.id} onClick={() => setSelectedScan(s)}
                          sx={{ p: 1.25, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.25,
                            bgcolor: active ? tokens.primarySoft : 'transparent',
                            border: active ? `1px solid ${tokens.primary}33` : '1px solid transparent',
                            '&:hover': { bgcolor: active ? tokens.primarySoft : tokens.surfaceMuted } }}>
                          <Avatar src={s.doctorPhoto} sx={{ width: 32, height: 32 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>{s.date}</Typography>
                            <Typography sx={{ fontWeight: active ? 700 : 600, fontSize: 12,
                              color: active ? tokens.primary : tokens.textPrimary }} noWrap>
                              {s.type}
                            </Typography>
                          </Box>
                          {i === 0 && <FiberManualRecordIcon sx={{ fontSize: 8, color: tokens.primary }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>

              {/* Latest blood test */}
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Latest Blood Test</Typography>
                    <IconButton size="small"><OpenInNewRoundedIcon sx={{ fontSize: 14 }} /></IconButton>
                  </Box>
                  <Grid container spacing={1}>
                    {[
                      { label: 'CRP', value: '1.8 mg/L', sub: 'Slightly elevated', color: tokens.warning },
                      { label: 'WBC', value: '8,500/μL', sub: 'No infection', color: tokens.primary },
                      { label: 'ESR', value: '12 mm/hr', sub: 'No issues', color: tokens.success },
                      { label: 'HGB', value: '15.1 g/dL', sub: 'No anemia', color: tokens.primary },
                    ].map((b) => (
                      <Grid key={b.label} size={6}>
                        <Box sx={{ p: 1, bgcolor: tokens.surfaceMuted, borderRadius: 2 }}>
                          <Chip label={b.label} size="small"
                            sx={{ bgcolor: `${b.color}18`, color: b.color, fontWeight: 700, fontSize: 10, height: 20, mb: 0.5 }} />
                          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{b.value}</Typography>
                          <Typography sx={{ fontSize: 9, color: tokens.textTertiary }}>{b.sub}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                    <Avatar src={doctorPhotos.rajesh} sx={{ width: 20, height: 20 }} />
                    <Typography sx={{ fontSize: 10, color: tokens.textTertiary }}>Dr. Rajesh Kumar · April 28, 2026</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Center: Body viewer */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card sx={{ height: '100%', overflow: 'hidden', position: 'relative', bgcolor: '#0B1220' }}>
              <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', '&:last-child': { pb: 0 } }}>
                {/* Viewer toolbar */}
                <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    Body Map · {selectedScan?.type || 'Select area'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><ZoomInRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><ZoomOutRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}><FullscreenRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
                  </Box>
                </Box>

                {/* Body with hotspots */}
                <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 480, background: 'radial-gradient(ellipse at center, #1a2744 0%, #0B1220 70%)' }}>
                  {/* Anatomical silhouette */}
                  <Box sx={{ width: 180, height: 420, position: 'relative' }}>
                    <svg viewBox="0 0 180 420" width="180" height="420" fill="none">
                      {/* Head */}
                      <ellipse cx="90" cy="35" rx="28" ry="32" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" fill="rgba(37,99,235,0.05)" />
                      {/* Neck */}
                      <rect x="78" y="65" width="24" height="20" rx="8" stroke="rgba(37,99,235,0.2)" strokeWidth="1" fill="none" />
                      {/* Torso */}
                      <path d="M50 85 Q45 120 48 180 Q50 220 55 260 L125 260 Q130 220 132 180 Q135 120 130 85 Z"
                        stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" fill="rgba(37,99,235,0.04)" />
                      {/* Arms */}
                      <path d="M50 90 Q30 130 20 180 Q15 200 18 220" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" fill="none" />
                      <path d="M130 90 Q150 130 160 180 Q165 200 162 220" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" fill="none" />
                      {/* Legs */}
                      <path d="M65 260 Q60 310 58 360 Q57 380 60 400" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" fill="none" />
                      <path d="M115 260 Q120 310 122 360 Q123 380 120 400" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" fill="none" />
                      {/* Ribcage lines */}
                      <path d="M60 105 Q90 115 120 105" stroke="rgba(37,99,235,0.12)" strokeWidth="0.8" fill="none" />
                      <path d="M58 120 Q90 132 122 120" stroke="rgba(37,99,235,0.12)" strokeWidth="0.8" fill="none" />
                      <path d="M55 135 Q90 148 125 135" stroke="rgba(37,99,235,0.12)" strokeWidth="0.8" fill="none" />
                      <path d="M53 150 Q90 164 127 150" stroke="rgba(37,99,235,0.12)" strokeWidth="0.8" fill="none" />
                      {/* Spine */}
                      <line x1="90" y1="68" x2="90" y2="260" stroke="rgba(37,99,235,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>

                    {/* Interactive hotspots */}
                    {bodyHotspots.map((hs) => {
                      const active = activeHotspot === hs.id;
                      return (
                        <Tooltip key={hs.id} title={hs.label} arrow placement="right">
                          <Box onClick={() => handleHotspotClick(hs)}
                            sx={{ position: 'absolute', left: hs.x, top: hs.y, transform: 'translate(-50%, -50%)',
                              cursor: 'pointer', zIndex: 2 }}>
                            <motion.div animate={active ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}>
                              <Box sx={{ width: active ? 36 : 28, height: active ? 36 : 28, borderRadius: '50%',
                                bgcolor: active ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.15)',
                                border: active ? '2px solid rgba(37,99,235,0.8)' : '1px solid rgba(37,99,235,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 200ms ease',
                                '&:hover': { bgcolor: 'rgba(37,99,235,0.3)', border: '2px solid rgba(37,99,235,0.6)' } }}>
                                {active && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.primary }} />}
                              </Box>
                            </motion.div>
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>

                  {/* Floating scan type badges */}
                  <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {scanTypes.map((s) => (
                      <Chip key={s.label} label={s.label} size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontWeight: 600,
                          fontSize: 10, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}
                        clickable />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Detail panel */}
          <Grid size={{ xs: 12, md: 4 }}>
            <AnimatePresence mode="wait">
              {selectedScan && <DetailPanel key={selectedScan.id} scan={selectedScan} onClose={() => setSelectedScan(null)} />}
            </AnimatePresence>
          </Grid>
        </Grid>
      )}

      {/* ───── TAB 1: Upload ───── */}
      {activeTab === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              {!uploading ? (
                <Card onClick={handleUpload} sx={{ cursor: 'pointer', border: `2px dashed ${tokens.border}`, boxShadow: 'none',
                  '&:hover': { borderColor: tokens.primary, bgcolor: tokens.primarySoft } }}>
                  <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: 4, bgcolor: tokens.primarySoft,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UploadFileIcon sx={{ fontSize: 40, color: tokens.primary }} />
                      </Box>
                    </motion.div>
                    <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Drop your scan or report here</Typography>
                    <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
                      MRI, X-Ray, CT Scan, Blood Reports, Prescriptions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {['DICOM', 'JPEG', 'PNG', 'PDF'].map((f) => (
                        <Chip key={f} label={f} size="small" variant="outlined"
                          sx={{ borderColor: tokens.border, color: tokens.textSecondary, fontWeight: 700 }} />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>Max 50 MB · Encrypted & HIPAA compliant</Typography>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <AutoAwesomeIcon sx={{ color: tokens.primary, fontSize: 32, mb: 2 }} />
                    </motion.div>
                    <Typography sx={{ fontWeight: 700, mb: 2 }}>AI is analysing your scan...</Typography>
                    <LinearProgress sx={{ height: 8, borderRadius: 4, bgcolor: tokens.surfaceMuted,
                      '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: tokens.primary } }} />
                    <Stack spacing={1} sx={{ mt: 3, textAlign: 'left' }}>
                      {['Uploading scan', 'Pre-processing', 'AI analysis', 'Generating report'].map((s, i) => (
                        <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: i < 2 ? tokens.successSoft : tokens.surfaceMuted,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {i < 2 ? <CheckCircleRoundedIcon sx={{ fontSize: 14, color: tokens.success }} />
                              : <Typography sx={{ fontSize: 11, fontWeight: 700, color: tokens.textTertiary }}>{i + 1}</Typography>}
                          </Box>
                          <Typography sx={{ fontSize: 13, color: i < 2 ? tokens.textPrimary : tokens.textTertiary }}>{s}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>Quick Upload</Typography>
                {scanTypes.map((s) => (
                  <Card key={s.label} sx={{ cursor: 'pointer', '&:hover': { borderColor: s.color } }} onClick={handleUpload}>
                    <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${s.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 20, height: 20, borderRadius: 1, overflow: 'hidden' }}>
                          <SmartImage src={s.img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallbackColor={s.color} />
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{s.label}</Typography>
                        <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{s.desc}</Typography>
                      </Box>
                      <AddCircleOutlineRoundedIcon sx={{ fontSize: 20, color: tokens.textTertiary }} />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* ───── TAB 2: History ───── */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Stack spacing={1.5}>
            {scanHistory.map((s) => {
              const riskColor = s.risk === 'Low' ? tokens.success : s.risk === 'Medium' ? tokens.warning : tokens.danger;
              return (
                <Card key={s.id} sx={{ cursor: 'pointer', '&:hover': { borderColor: tokens.primary } }}
                  onClick={() => { setSelectedScan(s); setActiveTab(0); }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 2.5 } }}>
                    <Avatar src={s.doctorPhoto} sx={{ width: 48, height: 48 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{s.type}</Typography>
                        <Chip label={s.status} size="small"
                          sx={{ bgcolor: s.status === 'Reviewed' ? tokens.successSoft : tokens.warningSoft,
                            color: s.status === 'Reviewed' ? tokens.success : tokens.warning,
                            fontWeight: 700, fontSize: 10, height: 20 }} />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary, mb: 0.5 }}>{s.date} · {s.doctor}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textTertiary }} noWrap>{s.findings}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 12, color: tokens.textTertiary, mb: 0.5 }}>Confidence</Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, color: tokens.primary }}>{s.confidence}%</Typography>
                      <Chip label={s.risk} size="small" sx={{ bgcolor: `${riskColor}18`, color: riskColor, fontWeight: 700, fontSize: 10, height: 18, mt: 0.5 }} />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </motion.div>
      )}
    </PageTransition>
  );
}
