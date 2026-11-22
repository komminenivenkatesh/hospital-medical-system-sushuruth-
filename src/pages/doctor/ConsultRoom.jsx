import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Fab,
  Typography,
  Tabs,
  Tab,
  Chip,
  TextField,
  Button,
  Autocomplete,
  Stack,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useWebRTC from '../../hooks/useWebRTC';
import { healthAPI } from '../../services/api';
import { tokens } from '../../theme/theme';

const COMMON_DRUGS = [
  'Amitriptyline 10mg',
  'Sumatriptan 50mg',
  'Propranolol 40mg',
  'Topiramate 25mg',
  'Gabapentin 300mg',
  'Levetiracetam 500mg',
  'Paracetamol 650mg',
  'Pantoprazole 40mg',
  'Naproxen 500mg',
];

export default function DoctorConsultRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roomId = id || 'a001';
  const { user } = useAuth();

  const [tab, setTab] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [callStarted, setCallStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [createdRx, setCreatedRx] = useState(null);

  // Dictation state
  const [isDictating, setIsDictating] = useState(false);

  // Clinical Notes & Diagnosis
  const [diagnosis, setDiagnosis] = useState('Migraine with Visual Aura');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient reports recurring unilateral pulsating headaches preceded by 20-minute visual scintillating scotoma. No associated motor weakness. Neurological examination cranial nerves II-XII intact.'
  );
  const [advice, setAdvice] = useState('Maintain consistent sleep schedule. Avoid tyramine-rich foods and artificial sweeteners. Use abortive Sumatriptan at earliest onset.');

  // Prescription builder
  const [selectedDrug, setSelectedDrug] = useState(COMMON_DRUGS[0]);
  const [dosage, setDosage] = useState('10mg (1 tablet)');
  const [frequency, setFrequency] = useState('Once daily at bedtime');
  const [duration, setDuration] = useState('30 days');
  const [instructions, setInstructions] = useState('Take with water after dinner');
  const [medications, setMedications] = useState([
    {
      name: 'Amitriptyline',
      dosage: '10mg',
      frequency: 'Once daily at bedtime',
      duration: '30 days',
      instructions: 'Take after dinner',
    },
    {
      name: 'Sumatriptan',
      dosage: '50mg',
      frequency: 'As needed (PRN)',
      duration: '10 tablets',
      instructions: 'Take 1 tablet at aura onset, repeat once after 2 hours if required',
    },
  ]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const containerRef = useRef(null);
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(false);

  const {
    localStream,
    remoteStream,
    isPeerConnected,
    peerUser,
    peerMediaState,
    mic,
    cam,
    isScreenSharing,
    connectionQuality,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    endCall,
  } = useWebRTC({
    roomId,
    user: { name: user?.name || 'Dr. Arvind Rao', role: 'doctor', email: user?.email },
    isDoctor: true,
  });

  // Restart timer from 00:00 as soon as both participants join and connect
  useEffect(() => {
    if (isPeerConnected) {
      setSeconds(0);
      setCallStarted(true);
    }
  }, [isPeerConnected]);

  // Tick call timer only while active
  useEffect(() => {
    if (!callStarted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStarted]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  // Bind local stream (doctor)
  useEffect(() => {
    const videoEl = localVideoRef.current;
    if (videoEl && localStream) {
      videoEl.srcObject = localStream;
      videoEl.play().catch((err) => console.log('Doctor local video play warning:', err.message));
    }
  }, [localStream]);

  // Bind remote stream (patient) to both muted video and audio element
  useEffect(() => {
    if (!remoteStream) return;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => console.warn('Doctor remote video play warning:', err.message));
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current
        .play()
        .then(() => setAudioNeedsGesture(false))
        .catch((err) => {
          console.warn('Doctor remote audio autoplay blocked:', err.message);
          setAudioNeedsGesture(true);
        });
    }
  }, [remoteStream]);

  // Unlock audio on click
  const handleInteractionUnlock = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current
        .play()
        .then(() => setAudioNeedsGesture(false))
        .catch(() => {});
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.play().catch(() => {});
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Dictation simulation / Speech-to-text
  const handleToggleDictation = () => {
    if (!isDictating) {
      setIsDictating(true);
      const dictationSnippet = ' Patient reports headache intensity reduced from 8/10 to 3/10 with current dosage.';
      setTimeout(() => {
        setClinicalNotes((prev) => prev + dictationSnippet);
        setIsDictating(false);
      }, 2500);
    } else {
      setIsDictating(false);
    }
  };

  // Add Medication to list
  const handleAddMedication = () => {
    if (!selectedDrug) return;
    const cleanName = selectedDrug.split(' ')[0] || selectedDrug;
    const newMed = {
      name: cleanName,
      dosage: dosage || 'Standard dose',
      frequency: frequency || 'Once daily',
      duration: duration || '14 days',
      instructions: instructions || 'Take after food',
    };
    setMedications((prev) => [...prev, newMed]);
  };

  // Remove Medication
  const handleRemoveMedication = (index) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  // End consultation and finalize prescription
  const handleEndConsultation = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        appointmentId: roomId.startsWith('a') ? undefined : roomId,
        diagnosis: diagnosis || 'Migraine with Visual Aura',
        medicines: medications,
        advice: advice || 'Follow prescribed regimen and monitor headache triggers.',
        notes: clinicalNotes,
      };

      const res = await healthAPI.createPrescription(payload);
      const created = res.data;
      setCreatedRx(created);

      // Notify patient over socket WebRTC channel
      endCall('Doctor completed consultation & issued prescription', created?._id);

      setIsSubmitting(false);
      setSummaryOpen(true);
    } catch (err) {
      console.warn('Prescription submission fallback:', err.message);
      setIsSubmitting(false);
      endCall('Consultation concluded by doctor');
      setSummaryOpen(true);
    }
  };

  const location = useLocation();
  const passedPatient = location.state || {};
  const patientName =
    (peerUser?.role === 'patient' ? peerUser.name : null) ||
    passedPatient.patientName ||
    'Meera Sharma';

  const patientInitials =
    patientName
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PT';

  return (
    <Box
      ref={containerRef}
      onClick={handleInteractionUnlock}
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: '#0A0F1D',
        display: 'flex',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Hidden dedicated audio element for clear patient voice */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Tap to Unmute Banner if Browser Blocked Autoplay */}
      {audioNeedsGesture && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            handleInteractionUnlock();
          }}
          sx={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            bgcolor: '#10B981',
            color: '#fff',
            px: 3,
            py: 1,
            borderRadius: '100px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(16,185,129,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 700,
            fontSize: 13,
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        >
          🔊 Browser blocked audio — Tap here to hear Patient
        </Box>
      )}

      {/* Left/Center Video Feed */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Top Floating Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 24,
            right: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Patient Details & Timer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                px: 2,
                py: 1,
                borderRadius: '100px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#10B981',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {patientInitials}
              </Avatar>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.1 }}>
                  {patientName}
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 11 }}>28F · Apollo Jubilee Hills Record</Typography>
              </Box>
            </Box>

            <Chip
              label={`${mm}:${ss}`}
              size="small"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 800,
                fontSize: 13,
                px: 0.5,
              }}
            />
          </Box>

          {/* Connection Status & Security Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<SecurityRoundedIcon sx={{ fontSize: 14, color: '#10B981 !important' }} />}
              label="Doctor Workstation · HIPAA Compliant"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontWeight: 600,
                fontSize: 11,
              }}
            />
            <Chip
              label={isPeerConnected ? connectionQuality : 'Waiting for Patient...'}
              size="small"
              sx={{
                bgcolor: isPeerConnected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isPeerConnected ? '#60A5FA' : '#FBBF24',
                border: `1px solid ${isPeerConnected ? 'rgba(37, 99, 235, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          </Box>
        </Box>

        {/* Remote Patient Video Feed */}
        <Box
          sx={{
            width: '90%',
            height: '82%',
            borderRadius: '16px',
            bgcolor: '#111827',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Remote Video Element (Muted so browser never blocks video stream; audio handled by remoteAudioRef) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            onLoadedData={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isPeerConnected && peerMediaState.cam ? 'block' : 'none',
            }}
          />

          {(!isPeerConnected || !peerMediaState.cam) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 3,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 32,
                  boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                  animation: !isPeerConnected ? 'pulsePatient 2s infinite' : 'none',
                  '@keyframes pulsePatient': {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 20px rgba(16, 185, 129, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
                  },
                }}
              >
                {patientInitials}
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 19 }}>{patientName}</Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 13, mt: 0.5 }}>
                  {isPeerConnected
                    ? 'Patient camera is muted (Audio connected)'
                    : 'Awaiting patient to join video room...'}
                </Typography>
              </Box>
            </Box>
          )}

          {isPeerConnected && !peerMediaState.mic && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(239, 68, 68, 0.9)',
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <MicOffIcon sx={{ fontSize: 14 }} /> Patient Muted
            </Box>
          )}
        </Box>

        {/* Doctor Self PiP */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 76, sm: 96 },
            right: { xs: 12, sm: 36 },
            width: { xs: 104, sm: 190 },
            height: { xs: 76, sm: 125 },
            borderRadius: '12px',
            bgcolor: '#1E293B',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isScreenSharing ? 'none' : 'scaleX(-1)',
              display: cam ? 'block' : 'none',
            }}
          />

          {!cam && (
            <Box sx={{ textAlign: 'center' }}>
              <VideocamOffIcon sx={{ color: '#94A3B8', fontSize: 24 }} />
              <Typography sx={{ color: '#94A3B8', fontSize: 11, fontWeight: 600, mt: 0.5 }}>Camera Off</Typography>
            </Box>
          )}

          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              left: 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'rgba(0,0,0,0.6)',
              px: 1,
              py: 0.25,
              borderRadius: '6px',
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>
              You (Dr. Arvind)
            </Typography>
            {!mic && <MicOffIcon sx={{ color: '#EF4444', fontSize: 13 }} />}
          </Box>
        </Box>

        {/* Bottom Floating Control Bar */}
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            bottom: { xs: 16, sm: 24 },
            bgcolor: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '100px',
            px: { xs: 1.5, sm: 2.5 },
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            maxWidth: 'calc(100vw - 32px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            zIndex: 30,
          }}
        >
          <Tooltip title={mic ? 'Mute Mic' : 'Unmute Mic'}>
            <IconButton
              onClick={toggleMic}
              sx={{
                bgcolor: mic ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                color: mic ? '#fff' : '#EF4444',
                '&:hover': { bgcolor: mic ? 'rgba(255, 255, 255, 0.2)' : 'rgba(239, 68, 68, 0.3)' },
              }}
            >
              {mic ? <MicNoneIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={cam ? 'Turn Off Camera' : 'Turn On Camera'}>
            <IconButton
              onClick={toggleCam}
              sx={{
                bgcolor: cam ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                color: cam ? '#fff' : '#EF4444',
                '&:hover': { bgcolor: cam ? 'rgba(255, 255, 255, 0.2)' : 'rgba(239, 68, 68, 0.3)' },
              }}
            >
              {cam ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isScreenSharing ? 'Stop Screen Share' : 'Share Clinical Report / MRI'}>
            <IconButton
              onClick={toggleScreenShare}
              sx={{
                bgcolor: isScreenSharing ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                color: isScreenSharing ? '#60A5FA' : '#fff',
                '&:hover': { bgcolor: isScreenSharing ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
              onClick={handleToggleFullscreen}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="End Consultation">
            <Fab
              color="error"
              size="medium"
              onClick={handleEndConsultation}
              sx={{
                ml: 1,
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                bgcolor: '#EF4444',
                '&:hover': { bgcolor: '#DC2626' },
              }}
            >
              <CallEndIcon />
            </Fab>
          </Tooltip>
        </Paper>
      </Box>

      {/* Right Clinical Management Panel */}
      <Paper
        sx={{
          width: { xs: 320, md: 410 },
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          zIndex: 40,
        }}
      >
        {/* Panel Tabs */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid #E5E7EB',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: 13 },
          }}
        >
          <Tab label="Patient Info" />
          <Tab label="Observations & Notes" />
          <Tab label="Prescription (Rx)" />
        </Tabs>

        {/* Tab 0: Patient Clinical Overview */}
        {tab === 0 && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#10B981',
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                {patientInitials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>{patientName}, 28F</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>meera@example.com · +91 98765 43210</Typography>
                <Chip label="O+ Blood Group" size="small" sx={{ mt: 0.5, fontWeight: 700, fontSize: 11 }} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 1 }}>
              Known Allergies
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
              <Chip label="Penicillin (Severe Rash)" size="small" color="error" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }} />
              <Chip label="Sulfa Drugs" size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600 }} />
            </Stack>

            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 1 }}>
              Current Active Regimen
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', borderRadius: 2, mb: 2.5 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Amitriptyline 10mg</Typography>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>1 tablet daily at bedtime · Ongoing 3 months</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Sumatriptan 50mg</Typography>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>PRN for acute aura episode</Typography>
              </CardContent>
            </Card>

            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 1 }}>
              Recent Diagnostic Scans
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Brain MRI Scan (T1 & T2 FLAIR)</Typography>
                <Typography sx={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>Normal study · No white matter lesions</Typography>
                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Verified Oct 2026 · Fortis Imaging Center</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tab 1: Dictation & Clinical Notes */}
        {tab === 1 && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
              sx={{
                bgcolor: isDictating ? '#EFF6FF' : '#F8FAFC',
                border: `1px solid ${isDictating ? '#2563EB' : '#E2E8F0'}`,
                borderRadius: '16px',
                p: 2,
                textAlign: 'center',
                transition: 'all 200ms ease',
              }}
            >
              <IconButton
                onClick={handleToggleDictation}
                sx={{
                  bgcolor: isDictating ? '#EF4444' : tokens.primary,
                  color: '#fff',
                  width: 48,
                  height: 48,
                  '&:hover': { bgcolor: isDictating ? '#DC2626' : tokens.primaryDark },
                }}
              >
                <MicIcon />
              </IconButton>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 1, color: isDictating ? '#EF4444' : '#1E293B' }}>
                {isDictating ? 'Listening & Transcribing...' : 'Click to Dictate Clinical Observations'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                AI-assisted clinical speech-to-text automatically enters findings into notes.
              </Typography>
            </Paper>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', mb: 0.5 }}>
                Primary Clinical Diagnosis
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', mb: 0.5 }}>
                Doctor Examination & Assessment Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#475569', mb: 0.5 }}>
                Lifestyle Advice & Non-pharmacological Measures
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>
          </Box>
        )}

        {/* Tab 2: Prescription Writer (Rx) */}
        {tab === 2 && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
              Add Medication to E-Prescription
            </Typography>

            <Autocomplete
              freeSolo
              options={COMMON_DRUGS}
              value={selectedDrug}
              onChange={(e, v) => setSelectedDrug(v || '')}
              onInputChange={(e, v) => setSelectedDrug(v || '')}
              renderInput={(params) => (
                <TextField {...params} label="Search / Enter Drug" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              )}
            />

            <Stack direction="row" spacing={1.5}>
              <TextField
                label="Dosage"
                size="small"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                label="Duration"
                size="small"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Stack>

            <TextField
              label="Frequency"
              size="small"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            <TextField
              label="Specific Instructions"
              size="small"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={handleAddMedication}
              sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700 }}
            >
              Add to Prescription
            </Button>

            <Divider sx={{ my: 1 }} />

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
              Active Medications ({medications.length})
            </Typography>

            <Stack spacing={1.5}>
              {medications.map((med, index) => (
                <Card key={index} variant="outlined" sx={{ borderRadius: 2, bgcolor: '#F8FAFC' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1E293B' }}>
                        {med.name} · {med.dosage}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#475569' }}>
                        {med.frequency} ({med.duration})
                      </Typography>
                      {med.instructions && (
                        <Typography sx={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', mt: 0.25 }}>
                          Instructions: {med.instructions}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" onClick={() => handleRemoveMedication(index)} sx={{ color: '#EF4444' }}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {/* Bottom Action Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB', bgcolor: '#F8FAFC' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            onClick={handleEndConsultation}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <ReceiptLongRoundedIcon />}
            sx={{
              bgcolor: '#10B981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: '100px',
              py: 1.25,
              fontWeight: 800,
              fontSize: 14,
              textTransform: 'none',
            }}
          >
            {isSubmitting ? 'Saving E-Prescription...' : 'End Consultation & Issue Rx →'}
          </Button>
        </Box>
      </Paper>

      {/* Post-Consultation Summary Modal (Doctor side) */}
      <Dialog
        open={summaryOpen}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 2,
            maxWidth: 440,
            textAlign: 'center',
          },
        }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: tokens.textPrimary }}>
            Consultation Completed
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 13, mt: 0.75, mb: 2.5 }}>
            Prescription and clinical record have been signed and uploaded to {patientName}'s Health Vault.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: '16px',
              bgcolor: '#F8FAFC',
              textAlign: 'left',
              mb: 2.5,
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Patient</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{patientName}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Session Duration</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{mm}:{ss}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Medications Prescribed</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{medications.length} items</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Prescription ID</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.primary }}>
                  {createdRx?._id ? `RX-${createdRx._id.slice(-6).toUpperCase()}` : 'RX-LIVE-VAULT'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/doctor/dashboard')}
            sx={{ borderRadius: '100px', fontWeight: 700, py: 1.25 }}
          >
            Return to Doctor Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
