import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Fab,
  Typography,
  Drawer,
  OutlinedInput,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SendIcon from '@mui/icons-material/Send';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useWebRTC from '../../hooks/useWebRTC';
import { tokens } from '../../theme/theme';

export default function ConsultRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const roomId = id || 'a001';
  const { user } = useAuth();
  const passedDoctor = location.state || {};

  const [seconds, setSeconds] = useState(0);
  const [callStarted, setCallStarted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const containerRef = useRef(null);
  const chatBottomRef = useRef(null);

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
    inCallMessages,
    callEndedInfo,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    sendChatMessage,
    endCall,
  } = useWebRTC({
    roomId,
    user: { name: user?.name || 'Meera Sharma', role: 'patient', email: user?.email },
    isDoctor: false,
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

  // Bind local stream
  useEffect(() => {
    const videoEl = localVideoRef.current;
    if (videoEl && localStream) {
      videoEl.srcObject = localStream;
      videoEl.play().catch((err) => console.log('Local video play warning:', err.message));
    }
  }, [localStream]);

  // Bind remote stream to both muted video (guaranteed visual playback) and audio element
  useEffect(() => {
    if (!remoteStream) return;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => console.warn('Remote video play warning:', err.message));
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current
        .play()
        .then(() => setAudioNeedsGesture(false))
        .catch((err) => {
          console.warn('Remote audio autoplay blocked by browser:', err.message);
          setAudioNeedsGesture(true);
        });
    }
  }, [remoteStream]);

  // Unlock audio on any click/tap if browser autoplay policy blocked it
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

  // Auto-scroll in-call chat
  useEffect(() => {
    if (chatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [inCallMessages, chatOpen]);

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

  const handleSendMessage = () => {
    if (!chatDraft.trim()) return;
    sendChatMessage(chatDraft.trim());
    setChatDraft('');
  };

  const handleConfirmEndCall = () => {
    setEndConfirmOpen(false);
    endCall('Patient ended the consultation');
  };

  const doctorName =
    (peerUser?.role === 'doctor' ? peerUser.name : null) ||
    passedDoctor.doctorName ||
    (roomId.toLowerCase().includes('priya') ? 'Dr. Priya Mehta' : 'Dr. Arvind Rao');

  const doctorSpecialty =
    (peerUser?.role === 'doctor' ? peerUser.specialty : null) ||
    passedDoctor.specialty ||
    (doctorName.includes('Priya') ? 'Cardiology · Max Healthcare' : 'Neurology · Fortis Hospital');

  const doctorInitials =
    passedDoctor.initials ||
    doctorName
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'DR';

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
      {/* Hidden dedicated audio element for clear, unmuted doctor voice */}
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
            bgcolor: '#2563EB',
            color: '#fff',
            px: 3,
            py: 1,
            borderRadius: '100px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(37,99,235,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 700,
            fontSize: 13,
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        >
          🔊 Browser blocked audio — Tap here to hear Doctor
        </Box>
      )}

      {/* Main Video Viewport */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Top Header Bar */}
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
          {/* Doctor Info & Timer */}
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
                  bgcolor: tokens.primary,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {doctorInitials}
              </Avatar>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.1 }}>
                  {doctorName}
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 11 }}>{doctorSpecialty}</Typography>
              </Box>
            </Box>

            {/* Timer Badge */}
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

          {/* Connection Quality & HIPAA Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<SecurityRoundedIcon sx={{ fontSize: 14, color: '#10B981 !important' }} />}
              label="E2E Encrypted · NABH/HIPAA"
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
              label={isPeerConnected ? connectionQuality : 'Waiting for Doctor...'}
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

        {/* Remote Video Display */}
        <Box
          sx={{
            width: '92%',
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

          {/* Remote Camera Off or Connecting State */}
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
                  width: 104,
                  height: 104,
                  borderRadius: '50%',
                  bgcolor: tokens.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 36,
                  boxShadow: '0 0 40px rgba(37, 99, 235, 0.4)',
                  animation: !isPeerConnected ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.7)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 20px rgba(37, 99, 235, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)' },
                  },
                }}
              >
                {doctorInitials}
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>{doctorName}</Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 13, mt: 0.5 }}>
                  {isPeerConnected
                    ? `${doctorName} has turned off camera (Audio connected)`
                    : `Connecting to ${doctorName}’s clinical workstation...`}
                </Typography>
              </Box>
              {!isPeerConnected && (
                <Chip
                  label={`Please wait · ${doctorName} is entering room`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', fontSize: 12 }}
                />
              )}
            </Box>
          )}

          {/* Remote Peer Mute Icon */}
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
              <MicOffIcon sx={{ fontSize: 14 }} /> Doctor Muted
            </Box>
          )}
        </Box>

        {/* Self Picture-in-Picture (PiP) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 76, sm: 96 },
            right: { xs: 12, sm: 48 },
            width: { xs: 104, sm: 200 },
            height: { xs: 76, sm: 130 },
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

          {/* Self Name & Mute Tag */}
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
            <Typography sx={{ color: '#fff', fontSize: 10, fontWeight: 700, truncate: true }}>
              You ({user?.name?.split(' ')[0] || 'Meera'})
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
          {/* Mute Button */}
          <Tooltip title={mic ? 'Mute Microphone' : 'Unmute Microphone'}>
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

          {/* Camera Button */}
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

          {/* Screen Share */}
          <Tooltip title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen (Medical Reports)'}>
            <IconButton
              onClick={toggleScreenShare}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: isScreenSharing ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                color: isScreenSharing ? '#60A5FA' : '#fff',
                '&:hover': { bgcolor: isScreenSharing ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>
          </Tooltip>

          {/* In-Call Chat */}
          <Tooltip title="In-Call Consultation Chat">
            <IconButton
              onClick={() => setChatOpen(!chatOpen)}
              sx={{
                bgcolor: chatOpen ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                color: chatOpen ? '#60A5FA' : '#fff',
                position: 'relative',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              <ChatBubbleOutlineIcon />
              {inCallMessages.length > 0 && !chatOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    bgcolor: '#EF4444',
                    borderRadius: '50%',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
              onClick={handleToggleFullscreen}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          {/* End Call Button */}
          <Tooltip title="Leave Consultation">
            <Fab
              color="error"
              size="medium"
              onClick={() => setEndConfirmOpen(true)}
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

      {/* In-Call Chat Drawer */}
      <Drawer
        anchor="right"
        variant="persistent"
        open={chatOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: 340,
            bgcolor: '#FFFFFF',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>In-Call Chat</Typography>
            <Typography sx={{ fontSize: 11, color: '#6B7280' }}>Encrypted real-time conversation</Typography>
          </Box>
          <IconButton size="small" onClick={() => setChatOpen(false)}>✕</IconButton>
        </Box>

        {/* Messages List */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {inCallMessages.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 'auto', p: 2 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: '#9CA3AF', mb: 1 }} />
              <Typography sx={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>No messages yet</Typography>
              <Typography sx={{ fontSize: 11, color: '#9CA3AF' }}>You and {doctorName} can share links and notes here</Typography>
            </Box>
          ) : (
            inCallMessages.map((msg) => {
              const isMe = msg.senderType === 'patient';
              return (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: '#6B7280', mb: 0.25, textAlign: isMe ? 'right' : 'left' }}>
                    {isMe ? 'You' : msg.sender || 'Doctor'}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: isMe ? tokens.primary : '#F1F5F9',
                      color: isMe ? '#fff' : '#1E293B',
                      p: 1.25,
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: 13,
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </Box>

        {/* Drawer Input */}
        <Box sx={{ p: 1.5, borderTop: '1px solid #E5E7EB' }}>
          <OutlinedInput
            fullWidth
            size="small"
            placeholder="Type message to doctor..."
            value={chatDraft}
            onChange={(e) => setChatDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleSendMessage}
                  sx={{ bgcolor: tokens.primary, color: '#fff', '&:hover': { bgcolor: tokens.primaryDark } }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
            sx={{ borderRadius: '100px', fontSize: 13 }}
          />
        </Box>
      </Drawer>

      {/* Leave Call Confirmation Dialog */}
      <Dialog open={endConfirmOpen} onClose={() => setEndConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Leave Consultation?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Are you sure you want to leave this video consultation with {doctorName}? You can rejoin anytime while the session is active.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEndConfirmOpen(false)}>Stay in Call</Button>
          <Button variant="contained" color="error" onClick={handleConfirmEndCall}>
            Leave Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post-Consultation Summary Modal (Shown when call is ended) */}
      <Dialog
        open={Boolean(callEndedInfo)}
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
            Consultation Concluded
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 13, mt: 0.75, mb: 2.5 }}>
            {callEndedInfo?.reason || 'Your consultation has been completed successfully.'}
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
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Attending Physician</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{doctorName}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Total Call Duration</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{mm}:{ss}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Clinical Prescription</Typography>
                <Chip
                  icon={<ReceiptLongRoundedIcon sx={{ fontSize: 14 }} />}
                  label="Issued to Vault"
                  size="small"
                  sx={{ bgcolor: '#DEF7EC', color: '#03543F', fontWeight: 700, fontSize: 11 }}
                />
              </Box>
            </Stack>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<MedicalServicesRoundedIcon />}
            onClick={() => navigate('/health')}
            sx={{ borderRadius: '100px', fontWeight: 700, py: 1.25 }}
          >
            View Prescriptions in Vault
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: '100px', fontWeight: 600 }}
          >
            Return to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
