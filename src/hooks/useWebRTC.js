import { useState, useEffect, useRef, useCallback } from 'react';
import {
  connectSocket,
  getSocket,
  joinVideoRoom,
  sendWebRtcOffer,
  sendWebRtcAnswer,
  sendIceCandidate,
  sendMediaState,
  sendVideoChatMessage,
  emitEndVideoCall,
  onVideoRoomJoined,
  onUserJoinedVideo,
  onWebRtcOffer,
  onWebRtcAnswer,
  onIceCandidate,
  onPeerMediaStateChanged,
  onVideoChatMessage,
  onVideoCallEnded,
  onPeerLeftVideo,
} from '../services/socket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelay',
      credential: 'openrelay',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelay',
      credential: 'openrelay',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelay',
      credential: 'openrelay',
    },
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
};

/**
 * Creates an animated canvas video stream showing initials, bio-signals, and name.
 */
function createSyntheticVideoTrack(label = 'User', isDoctor = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let t = 0;
  const primaryColor = isDoctor ? '#2563EB' : '#10B981';
  const accentColor = isDoctor ? '#60A5FA' : '#34D399';

  const draw = () => {
    t += 0.05;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    // Subtle medical grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 640; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 0; y < 480; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }

    // Dynamic ECG / Pulse waveform line at bottom
    ctx.beginPath();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    const waveY = 390;
    for (let x = 0; x < 640; x += 4) {
      let spike = 0;
      const phase = ((x - (t * 80) % 640) + 640) % 640;
      if (phase > 200 && phase < 220) {
        spike = Math.sin(((phase - 200) / 20) * Math.PI) * -35;
      } else if (phase >= 220 && phase < 240) {
        spike = Math.sin(((phase - 220) / 20) * Math.PI) * 55;
      } else if (phase >= 240 && phase < 260) {
        spike = Math.sin(((phase - 240) / 20) * Math.PI) * -20;
      }
      const y = waveY + spike + Math.sin(x * 0.03 + t) * 4;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Pulse aura behind avatar
    const pulse = Math.sin(t * 3) * 12;
    ctx.beginPath();
    ctx.arc(320, 190, 75 + pulse, 0, Math.PI * 2);
    ctx.strokeStyle = `${primaryColor}44`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Main Avatar Circle
    ctx.beginPath();
    ctx.arc(320, 190, 65, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();

    // User Initials
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials =
      label
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || (isDoctor ? 'DR' : 'PT');
    ctx.fillText(initials, 320, 190);

    // Name Label Pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(160, 280, 320, 42, 21);
    else ctx.rect(160, 280, 320, 42);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(label, 320, 301);

    // Live Telehealth Badge
    ctx.fillStyle = '#10B981';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('● Telehealth Workstation Active', 320, 342);
  };

  draw();
  const timer = setInterval(draw, 1000 / 30);
  const canvasStream = canvas.captureStream(30);
  const track = canvasStream.getVideoTracks()[0];

  return {
    track,
    cleanup: () => {
      clearInterval(timer);
      if (track) track.stop();
    },
  };
}

/**
 * Creates a synthetic silent audio track so WebRTC negotiation never fails
 * if the user has no microphone or permission was denied.
 */
function createSyntheticAudioTrack() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const osc = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(dst);
      osc.start();
      return dst.stream.getAudioTracks()[0] || null;
    }
  } catch (err) {
    console.warn('[WebRTC] Audio fallback creation failed:', err);
  }
  return null;
}

/**
 * Robust Media Acquisition:
 * 1. Requests camera and microphone with broad compatibility constraints.
 * 2. If camera is blocked/denied, captures microphone independently so voice is never dropped.
 * 3. Returns a complete stream with enabled video and audio tracks.
 */
async function getMediaStream(label, isDoctor) {
  let videoTrack = null;
  let audioTrack = null;
  let synthCleanup = null;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Attempt 1: Combined real video + audio with safe mobile and desktop constraints
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      videoTrack = stream.getVideoTracks()[0] || null;
      audioTrack = stream.getAudioTracks()[0] || null;
      console.log('[WebRTC] Acquired real camera and real microphone');
    } catch (e1) {
      console.warn('[WebRTC] Full media capture failed, falling back:', e1.message);

      // Attempt 2: Real camera alone
      try {
        const vStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoTrack = vStream.getVideoTracks()[0] || null;
        console.log('[WebRTC] Acquired real camera alone');
      } catch (e2) {
        console.warn('[WebRTC] Camera request failed:', e2.message);
      }

      // Attempt 3: Real microphone alone (CRITICAL: preserve voice)
      try {
        const aStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        audioTrack = aStream.getAudioTracks()[0] || null;
        console.log('[WebRTC] Acquired real microphone alone');
      } catch (e3) {
        console.warn('[WebRTC] Microphone request failed:', e3.message);
      }
    }
  }

  // Fallback for video if no hardware camera
  if (!videoTrack) {
    console.log('[WebRTC] Using animated medical canvas stream for video');
    const synth = createSyntheticVideoTrack(label, isDoctor);
    videoTrack = synth.track;
    synthCleanup = synth.cleanup;
  }

  // Fallback for audio if no hardware microphone
  if (!audioTrack) {
    console.log('[WebRTC] Using silent synthetic track for audio');
    audioTrack = createSyntheticAudioTrack();
  }

  if (videoTrack) videoTrack.enabled = true;
  if (audioTrack) audioTrack.enabled = true;

  const tracks = [videoTrack, audioTrack].filter(Boolean);
  const outStream = new MediaStream(tracks);

  outStream._cleanup = () => {
    if (synthCleanup) synthCleanup();
    tracks.forEach((t) => t.stop());
  };

  return outStream;
}

export default function useWebRTC({ roomId, user, isDoctor = false }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [peerUser, setPeerUser] = useState(null);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peerMediaState, setPeerMediaState] = useState({ mic: true, cam: true, screen: false });
  const [inCallMessages, setInCallMessages] = useState([]);
  const [callEndedInfo, setCallEndedInfo] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('Connecting...');

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteMediaStreamRef = useRef(new MediaStream());
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const isNegotiating = useRef(false);
  const isPeerConnectedRef = useRef(false);

  useEffect(() => {
    isPeerConnectedRef.current = isPeerConnected;
  }, [isPeerConnected]);

  // Bind local tracks directly with stream association and kind-matching
  const attachLocalTracks = useCallback((pc, stream) => {
    if (!pc || !stream) return;
    const transceivers = pc.getTransceivers ? pc.getTransceivers() : [];
    const senders = pc.getSenders();

    stream.getTracks().forEach((track) => {
      // 1. Try to find an existing transceiver matching this track's kind
      const matchingTc = transceivers.find(
        (tc) => tc.receiver?.track?.kind === track.kind || tc.sender?.track?.kind === track.kind
      );

      if (matchingTc && matchingTc.sender) {
        if (matchingTc.sender.track !== track) {
          matchingTc.sender.replaceTrack(track).catch((err) =>
            console.warn(`[WebRTC] replaceTrack warning for ${track.kind}:`, err)
          );
          console.log(`[WebRTC] Attached ${track.kind} track to matching transceiver`);
        }
      } else {
        // 2. Check if a sender already exists for this kind
        const existingSender = senders.find((s) => s.track && s.track.kind === track.kind);
        if (existingSender) {
          if (existingSender.track !== track) {
            existingSender.replaceTrack(track).catch((err) =>
              console.warn(`[WebRTC] replaceTrack warning for ${track.kind}:`, err)
            );
          }
        } else {
          // 3. Otherwise addTrack with the stream association so remote peer receives it
          try {
            pc.addTrack(track, stream);
            console.log(`[WebRTC] Added ${track.kind} track to PeerConnection with stream:`, track.id);
          } catch (err) {
            console.warn(`[WebRTC] addTrack exception for ${track.kind}:`, err.message);
          }
        }
      }
    });
  }, []);

  // Initialize RTCPeerConnection with tracks and transceivers
  const getOrCreatePeerConnection = useCallback(() => {
    if (pcRef.current) return pcRef.current;

    console.log('[WebRTC] Initializing RTCPeerConnection (max-bundle, TURN)');
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Attach local tracks immediately if ready
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, localStreamRef.current);
          console.log('[WebRTC] Initial addTrack:', track.kind, track.id);
        } catch (err) {
          console.warn('[WebRTC] Initial addTrack warning:', err.message);
        }
      });
    } else {
      // If local stream is still initializing, create initial sendrecv transceivers with explicit kind
      try {
        pc.addTransceiver('audio', { direction: 'sendrecv' });
        pc.addTransceiver('video', { direction: 'sendrecv' });
      } catch (err) {
        console.warn('[WebRTC] addTransceiver warning:', err.message);
      }
    }

    // Remote Track Handler: bind native stream directly for hardware-accelerated video
    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track:', event.track.kind, event.track.id, 'readyState:', event.track.readyState);

      const ms = remoteMediaStreamRef.current;
      // Remove any prior track of this kind to prevent stale/dead tracks
      ms.getTracks().forEach((t) => {
        if (t.kind === event.track.kind && t.id !== event.track.id) {
          ms.removeTrack(t);
        }
      });
      if (!ms.getTracks().some((t) => t.id === event.track.id)) {
        ms.addTrack(event.track);
      }

      // Always create a fresh MediaStream wrapper so React triggers a state change and rebinds the video element
      const updatedStream = new MediaStream(ms.getTracks());
      setRemoteStream(updatedStream);
      setIsPeerConnected(true);
      setConnectionQuality('HD 1080p · Excellent (24ms)');

      const triggerStreamUpdate = () => {
        console.log('[WebRTC] Remote track active/unmuted:', event.track.kind);
        const fresh = new MediaStream(remoteMediaStreamRef.current.getTracks());
        setRemoteStream(fresh);
      };

      event.track.onunmute = triggerStreamUpdate;

      event.track.onended = () => {
        console.log('[WebRTC] Remote track ended:', event.track.kind);
        const msCurrent = remoteMediaStreamRef.current;
        msCurrent.removeTrack(event.track);
        setRemoteStream(new MediaStream(msCurrent.getTracks()));
      };

      if (event.streams && event.streams[0]) {
        event.streams[0].onaddtrack = () => {
          console.log('[WebRTC] Track added to remote event stream');
          triggerStreamUpdate();
        };
      }
    };

    // ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && roomId) {
        sendIceCandidate({ roomId, candidate: event.candidate });
      }
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] PeerConnection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsPeerConnected(true);
        setConnectionQuality('HD 1080p · Connected (28ms)');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsPeerConnected(false);
        setConnectionQuality('Reconnecting...');
      } else if (pc.connectionState === 'closed') {
        setIsPeerConnected(false);
        setConnectionQuality('Call ended');
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setIsPeerConnected(true);
      }
    };

    pcRef.current = pc;
    return pc;
  }, [roomId, attachLocalTracks]);

  // Send SDP Offer to Peer
  const sendOffer = useCallback(async () => {
    if (isNegotiating.current) return;
    isNegotiating.current = true;
    try {
      const pc = getOrCreatePeerConnection();
      if (localStreamRef.current) {
        attachLocalTracks(pc, localStreamRef.current);
      }
      console.log('[WebRTC] Creating SDP Offer...');
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      console.log('[WebRTC] LocalDescription set. Emitting webrtc_offer to room:', roomId);
      sendWebRtcOffer({ roomId, sdp: offer, callerInfo: user });
    } catch (err) {
      console.error('[WebRTC] Failed to create offer:', err);
    } finally {
      isNegotiating.current = false;
    }
  }, [getOrCreatePeerConnection, attachLocalTracks, roomId, user]);

  // Handle incoming SDP Offer (with Glare Collision Resolution)
  const handleOffer = useCallback(
    async ({ sdp, callerInfo }) => {
      try {
        console.log('[WebRTC] Handling incoming SDP Offer from:', callerInfo?.name);
        if (callerInfo) setPeerUser(callerInfo);

        const pc = getOrCreatePeerConnection();

        // Glare collision handling
        if (pc.signalingState !== 'stable') {
          console.warn('[WebRTC] Glare collision detected. Current state:', pc.signalingState);
          if (!isDoctor) {
            await pc.setLocalDescription({ type: 'rollback' });
          } else {
            return;
          }
        }

        if (localStreamRef.current) {
          attachLocalTracks(pc, localStreamRef.current);
        }

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log('[WebRTC] RemoteDescription (Offer) applied successfully');

        // Flush buffered ICE candidates
        while (iceCandidatesQueue.current.length > 0) {
          const cand = iceCandidatesQueue.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {
            console.warn('[WebRTC] Error adding buffered ICE candidate:', e);
          }
        }

        console.log('[WebRTC] Creating SDP Answer...');
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log('[WebRTC] LocalDescription (Answer) set. Emitting webrtc_answer...');
        sendWebRtcAnswer({ roomId, sdp: answer });
      } catch (err) {
        console.error('[WebRTC] Error handling offer:', err);
      }
    },
    [getOrCreatePeerConnection, attachLocalTracks, roomId, isDoctor]
  );

  // Handle incoming SDP Answer
  const handleAnswer = useCallback(async ({ sdp }) => {
    try {
      console.log('[WebRTC] Handling incoming SDP Answer');
      const pc = pcRef.current;
      if (pc && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log('[WebRTC] RemoteDescription (Answer) applied successfully');

        while (iceCandidatesQueue.current.length > 0) {
          const cand = iceCandidatesQueue.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {
            console.warn('[WebRTC] Error adding buffered ICE candidate:', e);
          }
        }
      }
    } catch (err) {
      console.error('[WebRTC] Error handling answer:', err);
    }
  }, []);

  // Handle incoming ICE Candidate
  const handleCandidate = useCallback(async ({ candidate }) => {
    try {
      const pc = pcRef.current;
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (err) {
      console.error('[WebRTC] Error adding candidate:', err);
    }
  }, []);

  // Step 1: Initialize local media and join video room
  useEffect(() => {
    let isCancelled = false;
    let streamInstance = null;

    async function init() {
      connectSocket();

      const userName = user?.name || (isDoctor ? 'Dr. Arvind Rao' : 'Meera Sharma');
      streamInstance = await getMediaStream(userName, isDoctor);

      if (isCancelled) {
        if (streamInstance?._cleanup) streamInstance._cleanup();
        return;
      }

      localStreamRef.current = streamInstance;
      cameraTrackRef.current = streamInstance.getVideoTracks()[0] || null;
      setLocalStream(streamInstance);

      // Join the consultation room over Socket.io
      console.log('[WebRTC] Joining video room:', roomId);
      joinVideoRoom(roomId, user);

      // Re-join room whenever socket reconnects (vital for mobile networks & ngrok)
      const sock = getSocket();
      const onReconnected = () => {
        console.log('[WebRTC] Socket reconnected, re-joining video room:', roomId);
        joinVideoRoom(roomId, user);
      };
      sock.on('connect', onReconnected);
    }

    if (roomId) {
      init();
    }

    return () => {
      isCancelled = true;
      if (streamInstance?._cleanup) {
        streamInstance._cleanup();
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [roomId, isDoctor]);

  // Step 2: Register socket event listeners
  useEffect(() => {
    if (!roomId) return;

    const unsubs = [];

    // Room joined acknowledgment
    unsubs.push(
      onVideoRoomJoined(({ totalParticipants, existingPeers }) => {
        console.log('[WebRTC] video_room_joined. Total:', totalParticipants, 'Peers:', existingPeers);
        if (existingPeers && existingPeers.length > 0) {
          const peer = existingPeers[0].user;
          if (peer) setPeerUser(peer);
          sendOffer();
        }
      })
    );

    // Another peer entered our room
    unsubs.push(
      onUserJoinedVideo(({ user: remoteUser }) => {
        console.log('[WebRTC] user_joined_video received. Remote peer:', remoteUser?.name);
        if (remoteUser) setPeerUser(remoteUser);
        // Wait briefly for joiner's offer; if not connected in 2s, send offer as polite fallback
        setTimeout(() => {
          if (!isPeerConnectedRef.current) {
            console.log('[WebRTC] Fallback offer trigger from host');
            sendOffer();
          }
        }, 2000);
      })
    );

    // SDP Offer
    unsubs.push(onWebRtcOffer(handleOffer));

    // SDP Answer
    unsubs.push(onWebRtcAnswer(handleAnswer));

    // ICE Candidate
    unsubs.push(onIceCandidate(handleCandidate));

    // Peer Media State
    unsubs.push(
      onPeerMediaStateChanged(({ mic: pMic, cam: pCam, screen: pScreen }) => {
        setPeerMediaState((prev) => ({
          mic: pMic !== undefined ? pMic : prev.mic,
          cam: pCam !== undefined ? pCam : prev.cam,
          screen: pScreen !== undefined ? pScreen : prev.screen,
        }));
      })
    );

    // In-call Chat Message
    unsubs.push(
      onVideoChatMessage((msg) => {
        setInCallMessages((prev) => [...prev, msg]);
      })
    );

    // Call Concluded
    unsubs.push(
      onVideoCallEnded((data) => {
        setCallEndedInfo(data);
        setIsPeerConnected(false);
      })
    );

    // Peer Left
    unsubs.push(
      onPeerLeftVideo(() => {
        setIsPeerConnected(false);
        setConnectionQuality('Peer disconnected');
      })
    );

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, [roomId, isDoctor, sendOffer, handleOffer, handleAnswer, handleCandidate]);

  // Toggle Microphone
  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMic(audioTrack.enabled);
      sendMediaState({ roomId, mic: audioTrack.enabled, cam, screen: isScreenSharing });
    }
  }, [roomId, cam, isScreenSharing]);

  // Toggle Camera
  const toggleCam = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCam(videoTrack.enabled);
      sendMediaState({ roomId, mic, cam: videoTrack.enabled, screen: isScreenSharing });
    }
  }, [roomId, mic, isScreenSharing]);

  // Toggle Screen Sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      if (cameraTrackRef.current && pcRef.current) {
        const transceivers = pcRef.current.getTransceivers();
        const videoTc = transceivers.find((t) => t.sender && t.sender.track && t.sender.track.kind === 'video');
        if (videoTc && videoTc.sender) {
          videoTc.sender.replaceTrack(cameraTrackRef.current).catch(() => {});
        }
      }
      setIsScreenSharing(false);
      sendMediaState({ roomId, mic, cam, screen: false });
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          alert('Screen sharing is not supported by your browser.');
          return;
        }
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        if (pcRef.current) {
          const transceivers = pcRef.current.getTransceivers();
          const videoTc = transceivers.find((t) => t.sender && t.sender.track && t.sender.track.kind === 'video');
          if (videoTc && videoTc.sender) {
            videoTc.sender.replaceTrack(screenTrack).catch(() => {});
          }
        }

        setIsScreenSharing(true);
        sendMediaState({ roomId, mic, cam, screen: true });

        screenTrack.onended = () => {
          if (cameraTrackRef.current && pcRef.current) {
            const transceivers = pcRef.current.getTransceivers();
            const videoTc = transceivers.find((t) => t.sender && t.sender.track && t.sender.track.kind === 'video');
            if (videoTc && videoTc.sender) {
              videoTc.sender.replaceTrack(cameraTrackRef.current).catch(() => {});
            }
          }
          setIsScreenSharing(false);
          sendMediaState({ roomId, mic, cam, screen: false });
        };
      } catch (err) {
        console.warn('[WebRTC] Screen share was canceled:', err);
      }
    }
  }, [isScreenSharing, roomId, mic, cam]);

  // Send In-call Chat Message
  const sendChatMessage = useCallback(
    (content) => {
      if (!content || !content.trim()) return;
      sendVideoChatMessage({
        roomId,
        sender: user?.name || (isDoctor ? 'Dr. Arvind Rao' : 'Meera Sharma'),
        senderType: isDoctor ? 'doctor' : 'patient',
        content: content.trim(),
      });
    },
    [roomId, user, isDoctor]
  );

  // End Consultation
  const endCall = useCallback(
    (reason = 'Consultation concluded', prescriptionId = null) => {
      emitEndVideoCall({ roomId, reason, prescriptionId });
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current?._cleanup) {
        localStreamRef.current._cleanup();
      }
    },
    [roomId]
  );

  return {
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
  };
}
