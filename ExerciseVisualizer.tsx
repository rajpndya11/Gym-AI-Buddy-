import React, { useState, useEffect, useRef } from 'react';
import { AnimationType } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Activity,
  BookOpen,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wind,
  Loader2,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface ExerciseVisualizerProps {
  type: AnimationType;
  exerciseName: string;
  targetMuscles: string[];
  videoUrl?: string;
  instructions?: [string, string, string];
  formTip?: string;
  commonMistake?: string;
}

export const ExerciseVisualizer: React.FC<ExerciseVisualizerProps> = ({
  type,
  exerciseName,
  targetMuscles,
  videoUrl,
  instructions = [
    'Set up your position firmly with stable posture and balanced grip.',
    'Execute the movement with controlled tempo, driving with target muscles.',
    'Return smoothly to starting position without losing muscle tension.',
  ],
  formTip = 'Keep your core braced and maintain controlled tempo throughout.',
  commonMistake = 'Do not use excessive momentum or bounce weights at the reversal point.',
}) => {
  // Modes: 'video' (real demo video), 'form' (clear visual anatomy & motion map), 'cues' (step-by-step technique breakdown)
  const [viewMode, setViewMode] = useState<'video' | 'form' | 'cues'>('video');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [phase, setPhase] = useState<'SETUP' | 'DRIVE' | 'PEAK & RETURN'>('SETUP');

  // Vector animation loop state for form & anatomy visualizer
  const [motionProgress, setMotionProgress] = useState<number>(0.5);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Robust HTML5 video autoplay & lifecycle handling for iframes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || viewMode !== 'video') return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAutoplayBlocked(false);
          })
          .catch((err) => {
            console.warn('Autoplay blocked by browser policy:', err);
            setAutoplayBlocked(true);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, viewMode, videoUrl]);

  // Reset video state when videoUrl changes
  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    setAutoplayBlocked(false);
    setVideoProgress(0);
    setIsPlaying(true);
  }, [videoUrl]);

  // Handle video time update to compute current phase and scrubber progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (!duration || isNaN(duration)) return;

    const progress = (currentTime / duration) * 100;
    setVideoProgress(progress);

    if (progress < 25) {
      setPhase('SETUP');
    } else if (progress < 70) {
      setPhase('DRIVE');
    } else {
      setPhase('PEAK & RETURN');
    }
  };

  // Video scrubber seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setVideoProgress(pct * 100);
  };

  // Toggle speed between 1x, 0.75x, 0.5x
  const handleCycleSpeed = () => {
    const speeds = [1.0, 0.75, 0.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  // Continuous animation loop for anatomical form mode
  useEffect(() => {
    if (viewMode !== 'form') return;
    if (!isPlaying) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 2600 / playbackSpeed;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const t = elapsed / duration;
      // Smooth sinusoidal cycle 0 -> 1 -> 0
      const progress = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);
      setMotionProgress(progress);

      if (progress < 0.2) setPhase('SETUP');
      else if (progress < 0.75) setPhase('DRIVE');
      else setPhase('PEAK & RETURN');

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, viewMode, playbackSpeed]);

  // Restart repetition
  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setMotionProgress(0);
    setIsPlaying(true);
  };

  // Start video on manual tap if autoplay was prevented
  const handleStartVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setAutoplayBlocked(false);
          setIsPlaying(true);
          setVideoError(false);
        })
        .catch((err) => {
          console.error('Play error on tap:', err);
        });
    }
  };

  // HIGH-CRAFT ANATOMICAL FORM & MOVEMENT VISUALIZER
  // Clear, understandable athletic human model with muscle highlights & gym machinery
  const renderUnderstandableForm = () => {
    switch (type) {
      case 'pull_ups':
      case 'lat_pulldown': {
        // Pull-ups: athlete body moves up toward overhead bar (y=42)
        const bodyY = 125 - motionProgress * 42;
        const elbowY = bodyY - 10 + (1 - motionProgress) * 20;
        const elbowX = 135 - (1 - motionProgress) * 15;
        const latGlowOpacity = 0.25 + motionProgress * 0.75;

        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="pull-ups-anatomy-svg">
            <defs>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#444" />
                <stop offset="50%" stopColor="#888" />
                <stop offset="100%" stopColor="#333" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Gym Floor */}
            <line x1="30" y1="215" x2="310" y2="215" stroke="#222" strokeWidth="2" />

            {/* PULL-UP RIG / SQUAT RACK CAGE */}
            <rect x="65" y="25" width="10" height="190" fill="url(#metalGrad)" />
            <rect x="265" y="25" width="10" height="190" fill="url(#metalGrad)" />
            {/* Top horizontal cross-member */}
            <rect x="65" y="32" width="210" height="8" rx="2" fill="url(#metalGrad)" stroke="#222" />
            {/* Pull-up bar */}
            <line x1="60" y1="42" x2="280" y2="42" stroke="#C7FF3D" strokeWidth="6" strokeLinecap="round" />
            {/* Grip markers */}
            <rect x="110" y="38" width="16" height="8" rx="2" fill="#FFF" />
            <rect x="214" y="38" width="16" height="8" rx="2" fill="#FFF" />

            {/* ATHLETE HANGING & PULLING UP */}
            {/* Torso & Spine */}
            <path
              d={`M 170 ${bodyY} Q 169 ${bodyY + 35} 170 ${bodyY + 65}`}
              stroke="#333"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* ACTIVATED LATS (Glowing Wings) */}
            <path
              d={`M 166 ${bodyY + 10} C 142 ${bodyY + 22} 128 ${bodyY + 48} 152 ${bodyY + 60} C 162 ${bodyY + 50} 166 ${bodyY + 30} 166 ${bodyY + 10} Z`}
              fill="#C7FF3D"
              fillOpacity={latGlowOpacity}
              stroke="#C7FF3D"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />
            <path
              d={`M 174 ${bodyY + 10} C 198 ${bodyY + 22} 212 ${bodyY + 48} 188 ${bodyY + 60} C 178 ${bodyY + 50} 174 ${bodyY + 30} 174 ${bodyY + 10} Z`}
              fill="#C7FF3D"
              fillOpacity={latGlowOpacity}
              stroke="#C7FF3D"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />

            {/* Head & Neck */}
            <circle cx="170" cy={bodyY - 16} r="15" fill="#282828" stroke="#444" strokeWidth="2" />

            {/* ARMS (Hands on bar at y=42 -> Elbows -> Shoulders) */}
            {/* Left Arm */}
            <line x1="118" y1="42" x2={elbowX} y2={elbowY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2="154" y2={bodyY + 6} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx={elbowX} cy={elbowY} r="6" fill="#C7FF3D" />

            {/* Right Arm */}
            <line x1="222" y1="42" x2={340 - elbowX} y2={elbowY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1={340 - elbowX} y1={elbowY} x2="186" y2={bodyY + 6} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx={340 - elbowX} cy={elbowY} r="6" fill="#C7FF3D" />

            {/* Legs with crossed ankles hanging */}
            <line x1="165" y1={bodyY + 65} x2="168" y2={bodyY + 100} stroke="#222" strokeWidth="10" strokeLinecap="round" />
            <line x1="175" y1={bodyY + 65} x2="172" y2={bodyY + 100} stroke="#222" strokeWidth="10" strokeLinecap="round" />

            {/* MOTION DIRECTION ARROWS (Upward Drive) */}
            <path
              d={`M 170 ${bodyY + 120} L 170 ${bodyY + 95} M 165 ${bodyY + 102} L 170 ${bodyY + 95} L 175 ${bodyY + 102}`}
              stroke="#C7FF3D"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* ANATOMICAL CALLOUT LABELS */}
            <g transform="translate(10, 105)">
              <rect x="0" y="0" width="105" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="52" y="15" fill="#C7FF3D" fontSize="9" fontWeight="bold" textAnchor="middle">
                LATS & RHOMBOIDS
              </text>
            </g>
            <line x1="115" y1="116" x2="145" y2={bodyY + 35} stroke="#C7FF3D" strokeWidth="1" strokeDasharray="2 2" />

            <g transform="translate(225, 105)">
              <rect x="0" y="0" width="105" height="22" rx="6" fill="#141414" stroke="#22D3EE" strokeWidth="1" />
              <text x="52" y="15" fill="#22D3EE" fontSize="9" fontWeight="bold" textAnchor="middle">
                BICEPS & FOREARMS
              </text>
            </g>
            <line x1="225" y1="116" x2={340 - elbowX} y2={elbowY} stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );
      }

      case 'bench_press': {
        const barY = 138 - motionProgress * 54;
        const chestGlow = 0.25 + (1 - motionProgress) * 0.7;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="bench-press-anatomy-svg">
            <defs>
              <linearGradient id="benchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#303030" />
                <stop offset="100%" stopColor="#181818" />
              </linearGradient>
            </defs>
            {/* Bench Structure */}
            <line x1="30" y1="210" x2="310" y2="210" stroke="#222" strokeWidth="2" />
            <rect x="60" y="150" width="220" height="16" rx="4" fill="url(#benchGrad)" stroke="#3a3a3a" />
            <rect x="90" y="166" width="14" height="44" fill="#202020" />
            <rect x="236" y="166" width="14" height="44" fill="#202020" />

            {/* Barbell Rack Uprights */}
            <rect x="70" y="70" width="10" height="140" fill="#2c2c2c" stroke="#444" strokeWidth="1" />
            <rect x="260" y="70" width="10" height="140" fill="#2c2c2c" stroke="#444" strokeWidth="1" />

            {/* Athlete lying on bench (Side-Angle) */}
            <ellipse cx="170" cy="142" rx="70" ry="14" fill="#222" stroke="#333" />
            <circle cx="108" cy="140" r="16" fill="#2a2a2a" stroke="#444" />

            {/* PECTORALIS MAJOR (Chest Muscle Activation Glow) */}
            <ellipse
              cx="165"
              cy="138"
              rx="42"
              ry="14"
              fill="#C7FF3D"
              fillOpacity={chestGlow}
              stroke="#C7FF3D"
              strokeWidth="2"
            />

            {/* Arms driving up */}
            <line x1="145" y1="140" x2="135" y2={barY + 12} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="185" y1="140" x2="195" y2={barY + 12} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />

            {/* Barbell & Plates */}
            <line x1="45" y1={barY} x2="295" y2={barY} stroke="#C7FF3D" strokeWidth="6" strokeLinecap="round" />
            {/* Left Weight Plates */}
            <rect x="42" y={barY - 26} width="12" height="52" rx="3" fill="#333" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x="56" y={barY - 20} width="8" height="40" rx="2" fill="#222" stroke="#888" strokeWidth="1" />
            {/* Right Weight Plates */}
            <rect x="286" y={barY - 26} width="12" height="52" rx="3" fill="#333" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x="276" y={barY - 20} width="8" height="40" rx="2" fill="#222" stroke="#888" strokeWidth="1" />

            {/* Vertical Barbell Trajectory Indicator */}
            <line x1="170" y1="84" x2="170" y2="138" stroke="#C7FF3D" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

            {/* Labels */}
            <g transform="translate(125, 25)">
              <rect x="0" y="0" width="90" height="20" rx="5" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="45" y="14" fill="#C7FF3D" fontSize="9" fontWeight="bold" textAnchor="middle">
                CHEST (PECS)
              </text>
            </g>
          </svg>
        );
      }

      case 'shoulder_press': {
        const dumbbellY = 125 - motionProgress * 60;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="shoulder-press-anatomy-svg">
            <rect x="135" y="115" width="70" height="85" rx="6" fill="#242424" stroke="#333" />
            <circle cx="170" cy="85" r="18" fill="#2c2c2c" stroke="#444" />
            {/* Deltoids Glowing Left & Right */}
            <ellipse cx="130" cy="115" rx="16" ry="14" fill="#C7FF3D" fillOpacity={0.3 + motionProgress * 0.65} stroke="#C7FF3D" strokeWidth="1.5" />
            <ellipse cx="210" cy="115" rx="16" ry="14" fill="#C7FF3D" fillOpacity={0.3 + motionProgress * 0.65} stroke="#C7FF3D" strokeWidth="1.5" />
            {/* Arms */}
            <line x1="130" y1="115" x2="115" y2={dumbbellY + 8} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="210" y1="115" x2="225" y2={dumbbellY + 8} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            {/* Dumbbells */}
            <rect x="94" y={dumbbellY - 10} width="42" height="16" rx="4" fill="#3a3a3a" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x="204" y={dumbbellY - 10} width="42" height="16" rx="4" fill="#3a3a3a" stroke="#C7FF3D" strokeWidth="1.5" />
            <line x1="115" y1={dumbbellY - 10} x2="115" y2={dumbbellY + 6} stroke="#FFF" strokeWidth="4" />
            <line x1="225" y1={dumbbellY - 10} x2="225" y2={dumbbellY + 6} stroke="#FFF" strokeWidth="4" />

            <g transform="translate(110, 20)">
              <rect x="0" y="0" width="120" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="60" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                DELTOIDS (SHOULDERS)
              </text>
            </g>
          </svg>
        );
      }

      case 'goblet_squat': {
        const hipY = 105 + motionProgress * 40;
        const kneeY = 145 + motionProgress * 20;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="goblet-squat-anatomy-svg">
            <circle cx="170" cy={hipY - 58} r="18" fill="#282828" stroke="#444" />
            {/* Dumbbell held at chest */}
            <rect x="160" y={hipY - 35} width="20" height="26" rx="4" fill="#444" stroke="#C7FF3D" strokeWidth="2" />
            {/* Torso & Core */}
            <line x1="170" y1={hipY - 35} x2="170" y2={hipY} stroke="#555" strokeWidth="10" strokeLinecap="round" />
            {/* Quadriceps activation glow */}
            <ellipse cx="152" cy={kneeY - 15} rx="14" ry="22" fill="#C7FF3D" fillOpacity={0.3 + (1 - motionProgress) * 0.55} stroke="#C7FF3D" strokeWidth="1.5" />
            <ellipse cx="188" cy={kneeY - 15} rx="14" ry="22" fill="#C7FF3D" fillOpacity={0.3 + (1 - motionProgress) * 0.55} stroke="#C7FF3D" strokeWidth="1.5" />
            {/* Thighs and Shins */}
            <line x1="160" y1={hipY} x2="148" y2={kneeY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="180" y1={hipY} x2="192" y2={kneeY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="148" y1={kneeY} x2="148" y2="200" stroke="#777" strokeWidth="7" strokeLinecap="round" />
            <line x1="192" y1={kneeY} x2="192" y2="200" stroke="#777" strokeWidth="7" strokeLinecap="round" />
            <line x1="120" y1="200" x2="220" y2="200" stroke="#222" strokeWidth="3" />

            <g transform="translate(100, 20)">
              <rect x="0" y="0" width="140" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="70" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                QUADS & GLUTES (LEGS)
              </text>
            </g>
          </svg>
        );
      }

      case 'dumbbell_curl': {
        const curlAngle = 25 + motionProgress * 105;
        const handX = 170 + Math.sin((curlAngle * Math.PI) / 180) * 44;
        const handY = 125 - Math.cos((curlAngle * Math.PI) / 180) * 44;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="bicep-curl-anatomy-svg">
            <circle cx="170" cy="65" r="18" fill="#282828" stroke="#444" />
            <rect x="155" y="85" width="30" height="85" rx="8" fill="#202020" stroke="#333" />
            {/* BICEPS PEAK CONTRACTION GLOW */}
            <ellipse cx="170" cy="115" rx="16" ry="20" fill="#C7FF3D" fillOpacity={0.25 + motionProgress * 0.65} stroke="#C7FF3D" strokeWidth="2" />
            {/* Forearm & Dumbbell */}
            <line x1="170" y1="125" x2={handX} y2={handY} stroke="#FFF" strokeWidth="7" strokeLinecap="round" />
            <circle cx={handX} cy={handY} r="11" fill="#444" stroke="#C7FF3D" strokeWidth="2.5" />

            <g transform="translate(120, 20)">
              <rect x="0" y="0" width="100" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="50" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                BICEPS BRACHII
              </text>
            </g>
          </svg>
        );
      }

      case 'tricep_pushdown': {
        const pushY = 95 + motionProgress * 55;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="tricep-pushdown-anatomy-svg">
            <circle cx="170" cy="60" r="18" fill="#282828" stroke="#444" />
            <rect x="155" y="80" width="30" height="85" rx="8" fill="#202020" stroke="#333" />
            {/* TRICEPS HORSESHOE GLOW */}
            <ellipse cx="184" cy="110" rx="12" ry="18" fill="#C7FF3D" fillOpacity={0.25 + motionProgress * 0.65} stroke="#C7FF3D" strokeWidth="2" />
            {/* Cable & Rope */}
            <line x1="170" y1="20" x2="170" y2={pushY} stroke="#777" strokeWidth="2.5" strokeDasharray="3 2" />
            <line x1="170" y1={pushY} x2="155" y2={pushY + 18} stroke="#C7FF3D" strokeWidth="5" strokeLinecap="round" />
            <line x1="170" y1={pushY} x2="185" y2={pushY + 18} stroke="#C7FF3D" strokeWidth="5" strokeLinecap="round" />

            <g transform="translate(115, 20)">
              <rect x="0" y="0" width="110" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="55" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                TRICEPS (ARMS)
              </text>
            </g>
          </svg>
        );
      }

      case 'bent_over_row':
      case 'cable_row': {
        const pullProgress = motionProgress;
        const barY = 165 - pullProgress * 45;
        const elbowX = 145 - pullProgress * 25;
        const elbowY = 135 - pullProgress * 25;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="bent-over-row-anatomy-svg">
            {/* Gym Floor */}
            <line x1="30" y1="210" x2="310" y2="210" stroke="#222" strokeWidth="2" />
            {/* ATHLETE IN 45-DEGREE HINGED ROWING STANCE */}
            {/* Legs & Knees slightly bent */}
            <line x1="185" y1="210" x2="192" y2="165" stroke="#222" strokeWidth="12" strokeLinecap="round" />
            <line x1="192" y1="165" x2="175" y2="125" stroke="#222" strokeWidth="12" strokeLinecap="round" />
            {/* Torso hinged forward at 45 degrees */}
            <line x1="175" y1="125" x2="120" y2="85" stroke="#333" strokeWidth="18" strokeLinecap="round" />
            {/* Head looking forward-neutral */}
            <circle cx="108" cy="74" r="16" fill="#282828" stroke="#444" strokeWidth="2" />

            {/* ACTIVATED RHOMBOIDS & LATS (Mid Back Glow) */}
            <ellipse
              cx="145"
              cy="105"
              rx="18"
              ry="14"
              fill="#C7FF3D"
              fillOpacity={0.25 + pullProgress * 0.7}
              stroke="#C7FF3D"
              strokeWidth="2"
              transform="rotate(-35 145 105)"
            />

            {/* Arms driving elbows up and back */}
            <line x1="130" y1="92" x2={elbowX} y2={elbowY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2="148" y2={barY} stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx={elbowX} cy={elbowY} r="6" fill="#C7FF3D" />

            {/* Barbell & Plates */}
            <line x1="100" y1={barY} x2="196" y2={barY} stroke="#C7FF3D" strokeWidth="5" strokeLinecap="round" />
            <rect x="94" y={barY - 14} width="8" height="28" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x="194" y={barY - 14} width="8" height="28" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />

            {/* Motion Arrow */}
            <path
              d={`M 148 ${barY + 18} L 148 ${barY - 10} M 143 ${barY - 5} L 148 ${barY - 10} L 153 ${barY - 5}`}
              stroke="#C7FF3D"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="180" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="90" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                BENT-OVER ROW · MID BACK & LATS
              </text>
            </g>
          </svg>
        );
      }

      case 'incline_press':
      case 'chest_press': {
        const barProgress = 1 - motionProgress;
        const barX = 145 + motionProgress * 30;
        const barY = 115 - motionProgress * 40;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="incline-press-anatomy-svg">
            <line x1="30" y1="210" x2="310" y2="210" stroke="#222" strokeWidth="2" />
            {/* 35-DEGREE INCLINE BENCH */}
            <line x1="80" y1="185" x2="160" y2="95" stroke="#333" strokeWidth="14" strokeLinecap="round" />
            <line x1="160" y1="95" x2="185" y2="65" stroke="#444" strokeWidth="12" strokeLinecap="round" />
            <line x1="80" y1="185" x2="60" y2="195" stroke="#333" strokeWidth="12" strokeLinecap="round" />
            {/* Bench frame stands */}
            <line x1="90" y1="175" x2="90" y2="210" stroke="#222" strokeWidth="6" />
            <line x1="150" y1="110" x2="150" y2="210" stroke="#222" strokeWidth="6" />

            {/* ATHLETE LYING BACK */}
            <line x1="85" y1="178" x2="155" y2="102" stroke="#222" strokeWidth="16" strokeLinecap="round" />
            <circle cx="170" cy="80" r="16" fill="#282828" stroke="#444" strokeWidth="2" />

            {/* UPPER CHEST / CLAVICULAR PECS GLOW */}
            <ellipse
              cx="140"
              cy="118"
              rx="16"
              ry="14"
              fill="#C7FF3D"
              fillOpacity={0.25 + barProgress * 0.7}
              stroke="#C7FF3D"
              strokeWidth="2"
              transform="rotate(-35 140 118)"
            />

            {/* Pressing Arms */}
            <line x1="145" y1="112" x2={barX - 10} y2={barY + 20} stroke="#FFF" strokeWidth="7" strokeLinecap="round" />
            <line x1={barX - 10} y1={barY + 20} x2={barX} y2={barY} stroke="#FFF" strokeWidth="7" strokeLinecap="round" />

            {/* Incline Barbell & Weight Plates */}
            <line x1={barX - 45} y1={barY} x2={barX + 45} y2={barY} stroke="#C7FF3D" strokeWidth="5" strokeLinecap="round" />
            <rect x={barX - 52} y={barY - 14} width="8" height="28" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x={barX + 44} y={barY - 14} width="8" height="28" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />

            {/* Press direction arrows */}
            <path
              d={`M ${barX} ${barY + 25} L ${barX} ${barY - 5} M ${barX - 5} ${barY} L ${barX} ${barY - 5} L ${barX + 5} ${barY}`}
              stroke="#C7FF3D"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="180" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="90" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                INCLINE PRESS · UPPER CHEST
              </text>
            </g>
          </svg>
        );
      }

      case 'squat':
      case 'goblet_squat': {
        const squatDepth = motionProgress;
        const hipY = 120 + squatDepth * 42;
        const barY = 70 + squatDepth * 40;
        const kneeX = 152 + squatDepth * 18;
        const kneeY = 160 + squatDepth * 12;

        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="squat-anatomy-svg">
            <line x1="30" y1="210" x2="310" y2="210" stroke="#222" strokeWidth="2" />
            {/* ATHLETE PERFORMING SQUAT */}
            {/* Feet planted firmly */}
            <rect x="135" y="206" width="35" height="5" rx="2" fill="#444" />
            {/* Shins */}
            <line x1="145" y1="206" x2={kneeX} y2={kneeY} stroke="#222" strokeWidth="12" strokeLinecap="round" />
            {/* Thighs */}
            <line x1={kneeX} y1={kneeY} x2="185" y2={hipY} stroke="#333" strokeWidth="14" strokeLinecap="round" />

            {/* QUADRICEPS & GLUTES GLOW */}
            <ellipse
              cx={(kneeX + 185) / 2}
              cy={(kneeY + hipY) / 2}
              rx="18"
              ry="12"
              fill="#C7FF3D"
              fillOpacity={0.25 + squatDepth * 0.7}
              stroke="#C7FF3D"
              strokeWidth="2"
            />

            {/* Torso upright with chest proud */}
            <line x1="185" y1={hipY} x2="175" y2={barY + 15} stroke="#333" strokeWidth="16" strokeLinecap="round" />
            <circle cx="175" cy={barY} r="15" fill="#282828" stroke="#444" strokeWidth="2" />

            {/* BARBELL ON UPPER BACK/TRAPS */}
            <line x1="110" y1={barY + 12} x2="240" y2={barY + 12} stroke="#C7FF3D" strokeWidth="6" strokeLinecap="round" />
            <rect x="102" y={barY - 4} width="9" height="32" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />
            <rect x="239" y={barY - 4} width="9" height="32" rx="2" fill="#555" stroke="#C7FF3D" strokeWidth="1.5" />

            {/* Motion Arrows */}
            <path
              d={`M 175 ${barY + 35} L 175 ${barY + 60} M 170 ${barY + 54} L 175 ${barY + 60} L 180 ${barY + 54}`}
              stroke="#C7FF3D"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="160" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="80" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                SQUAT · QUADS & GLUTES
              </text>
            </g>
          </svg>
        );
      }

      case 'deadlift': {
        const liftProgress = motionProgress;
        const hipY = 155 - liftProgress * 35;
        const barY = 195 - liftProgress * 70;
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="deadlift-anatomy-svg">
            <line x1="30" y1="210" x2="310" y2="210" stroke="#222" strokeWidth="2" />
            {/* Feet */}
            <rect x="155" y="206" width="30" height="5" rx="2" fill="#444" />
            {/* Legs extending */}
            <line x1="165" y1="206" x2="160" y2={hipY} stroke="#222" strokeWidth="12" strokeLinecap="round" />
            {/* Torso pivoting to lockout */}
            <line x1="160" y1={hipY} x2="168" y2={hipY - 55} stroke="#333" strokeWidth="16" strokeLinecap="round" />
            <circle cx="170" cy={hipY - 70} r="15" fill="#282828" stroke="#444" strokeWidth="2" />

            {/* POSTERIOR CHAIN (Hamstrings & Glutes glow) */}
            <ellipse
              cx="160"
              cy={(206 + hipY) / 2}
              rx="12"
              ry="20"
              fill="#C7FF3D"
              fillOpacity={0.25 + liftProgress * 0.7}
              stroke="#C7FF3D"
              strokeWidth="2"
            />

            {/* Arms holding barbell at arms length */}
            <line x1="168" y1={hipY - 45} x2="170" y2={barY} stroke="#FFF" strokeWidth="7" strokeLinecap="round" />

            {/* Barbell & Plates */}
            <line x1="110" y1={barY} x2="230" y2={barY} stroke="#C7FF3D" strokeWidth="6" strokeLinecap="round" />
            <circle cx="112" cy={barY} r="18" fill="#333" stroke="#C7FF3D" strokeWidth="2" />
            <circle cx="228" cy={barY} r="18" fill="#333" stroke="#C7FF3D" strokeWidth="2" />

            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="180" height="22" rx="6" fill="#141414" stroke="#C7FF3D" strokeWidth="1" />
              <text x="90" y="15" fill="#C7FF3D" fontSize="10" fontWeight="bold" textAnchor="middle">
                DEADLIFT · POSTERIOR CHAIN
              </text>
            </g>
          </svg>
        );
      }

      default: {
        return (
          <svg viewBox="0 0 340 230" className="w-full h-full select-none" id="generic-anatomy-svg">
            <rect x="150" y="65" width="40" height="110" rx="12" fill="#222" stroke="#333" />
            <circle cx="170" cy="45" r="18" fill="#282828" stroke="#444" />
            <ellipse cx="170" cy="115" rx="30" ry="35" fill="#C7FF3D" fillOpacity={0.25 + motionProgress * 0.55} stroke="#C7FF3D" strokeWidth="2" />
            <circle cx="170" cy={120 - motionProgress * 25} r="12" fill="#C7FF3D" />
            <text x="170" y="210" fill="#888" fontSize="11" textAnchor="middle">
              Active Muscle Contraction: {targetMuscles.join(', ')}
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div
      className="bg-[#101010] border border-[#262626] rounded-3xl overflow-hidden shadow-2xl relative"
      id="production-exercise-visualizer"
    >
      {/* Top Header Mode Navigation Tabs */}
      <div className="px-3.5 py-2.5 bg-[#141414] border-b border-[#222222] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-xl border border-[#262626]">
          {/* Video Demo Button */}
          <button
            onClick={() => setViewMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'video'
                ? 'bg-[#C7FF3D] text-black shadow-md'
                : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
            }`}
            id="tab-video-demo"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Demo</span>
          </button>

          {/* Form & Muscle Map Button */}
          <button
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'form'
                ? 'bg-[#C7FF3D] text-black shadow-md'
                : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
            }`}
            id="tab-form-anatomy"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Muscle Map</span>
          </button>

          {/* Step-by-Step Guide Button */}
          <button
            onClick={() => setViewMode('cues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cues'
                ? 'bg-[#C7FF3D] text-black shadow-md'
                : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
            }`}
            id="tab-step-cues"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technique</span>
          </button>
        </div>

        {/* Phase Indicator Badge */}
        <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-[#2a2a2a] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#C7FF3D]">
            {phase}
          </span>
        </div>
      </div>

      {/* Main Visual Display Area */}
      <div className="relative w-full aspect-video bg-[#050505] flex items-center justify-center overflow-hidden">
        {/* VIEW 1: VIDEO DEMO */}
        {viewMode === 'video' && (
          <div className="relative w-full h-full">
            {videoUrl && !videoError ? (
              <>
                {/* Loading indicator */}
                {isVideoLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080808]/90 backdrop-blur-xs">
                    <Loader2 className="w-7 h-7 text-[#C7FF3D] animate-spin mb-2" />
                    <span className="text-xs text-[#8A8A8A] font-medium">
                      Loading demonstration video...
                    </span>
                  </div>
                )}

                {/* Video element with guaranteed cross-platform configuration */}
                <video
                  ref={videoRef}
                  key={videoUrl}
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  preload="auto"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsPlaying(!isPlaying)}
                  onLoadedData={() => {
                    setIsVideoLoading(false);
                    setVideoError(false);
                  }}
                  onCanPlay={() => {
                    setIsVideoLoading(false);
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onError={() => {
                    setIsVideoLoading(false);
                    setVideoError(true);
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>

                {/* Subtle vignette for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Tap to Play Overlay (if browser policy blocked immediate autoplay) */}
                {autoplayBlocked && (
                  <button
                    onClick={handleStartVideo}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs transition-all cursor-pointer group"
                    id="tap-to-play-overlay-btn"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#C7FF3D] text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-black translate-x-0.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#F5F5F5] mt-3 bg-[#111]/90 px-3 py-1.5 rounded-xl border border-[#333]">
                      Tap to Start Video Demo
                    </span>
                  </button>
                )}

                {/* Target Muscles Badge Overlay */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-[#C7FF3D] backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#C7FF3D]/30">
                    REAL GYM DEMO
                  </span>
                </div>

                {/* Interactive Scrubber Bar Overlaid at Bottom */}
                <div
                  onClick={handleSeek}
                  className="absolute bottom-0 left-0 right-0 h-2.5 bg-black/70 cursor-pointer group hover:h-3.5 transition-all z-20"
                  title="Click anywhere to scrub repetition"
                >
                  <div
                    className="h-full bg-[#C7FF3D] relative transition-all"
                    style={{ width: `${videoProgress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </>
            ) : (
              /* Fallback if video is unavailable or network blocked */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0d0d]">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB547]/15 border border-[#FFB547]/20 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-[#FFB547]" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5] mb-1">
                  Video Stream Deferred
                </h4>
                <p className="text-xs text-[#8A8A8A] max-w-xs mb-4">
                  Tap below to initialize the video player or switch to the interactive Muscle Map.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartVideo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Video</span>
                  </button>
                  <button
                    onClick={() => setViewMode('form')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202020] text-[#F5F5F5] font-semibold text-xs border border-[#333]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C7FF3D]" />
                    <span>View Muscle Map</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: FORM & MUSCLE MAP (High-Craft Vector Anatomy) */}
        {viewMode === 'form' && (
          <div className="w-full h-full p-2 flex flex-col items-center justify-center relative bg-[#080808]">
            {renderUnderstandableForm()}

            {/* Bottom Status Ticker */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#222]">
              <span className="text-[#8A8A8A]">
                Target: <strong className="text-[#F5F5F5]">{targetMuscles.join(', ')}</strong>
              </span>
              <span className="text-[#C7FF3D] font-mono font-bold">
                Loop: {(motionProgress * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* VIEW 3: STEP-BY-STEP TECHNIQUE GUIDE */}
        {viewMode === 'cues' && (
          <div className="w-full h-full p-4 overflow-y-auto bg-[#0d0d0d] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C7FF3D]">
                  VISUAL FORM BLUEPRINT
                </span>
                <span className="text-[10px] text-[#8A8A8A]">Master Beginner Form</span>
              </div>

              {instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141414] border border-[#222]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C7FF3D] text-black font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-[#F5F5F5] leading-snug">{step}</p>
                </div>
              ))}
            </div>

            {/* Breathing Pacer */}
            <div className="mt-2 bg-[#141414] border border-[#262626] rounded-xl p-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#C7FF3D]">
                <Wind className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Breath Guide:</span>
              </div>
              <span className="text-[11px] text-[#8A8A8A]">
                Exhale on drive · Inhale on control
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Media Controller Bar */}
      <div className="px-4 py-2.5 bg-[#141414] border-t border-[#222222] flex items-center justify-between">
        {/* Play / Pause Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202020] hover:bg-[#2b2b2b] text-xs font-bold text-[#F5F5F5] border border-[#333] transition-colors"
            id="video-play-pause-btn"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#C7FF3D]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#C7FF3D]" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Mute Toggle (for video mode) */}
          {viewMode === 'video' && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-[#202020] hover:bg-[#2b2b2b] text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#333] transition-colors"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#C7FF3D]" />
              )}
            </button>
          )}
        </div>

        {/* Slow-Motion Speed Cycler & Restart Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCycleSpeed}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#202020] hover:bg-[#2b2b2b] text-xs font-semibold text-[#F5F5F5] border border-[#333] transition-colors"
            title="Adjust slow-motion playback speed"
          >
            <Gauge className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span>{playbackSpeed}x</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-[#202020] hover:bg-[#2b2b2b] text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#333] transition-colors"
            title="Restart repetition loop"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Understandable Visual Form Cue Cards (DO vs DON'T) */}
      <div className="p-3 bg-[#0d0d0d] border-t border-[#1c1c1c] space-y-2">
        {/* DO: Pro Technique Tip */}
        <div className="flex items-start gap-2 bg-[#121a12] border border-[#C7FF3D]/25 rounded-2xl p-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#C7FF3D] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C7FF3D] block">
              CORRECT FORM
            </span>
            <p className="text-xs text-[#E5E5E5] mt-0.5 leading-snug">{formTip}</p>
          </div>
        </div>

        {/* DON'T: Common Mistake Alert */}
        <div className="flex items-start gap-2 bg-[#1c1313] border border-[#FF6B6B]/25 rounded-2xl p-2.5">
          <XCircle className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B6B] block">
              COMMON MISTAKE TO AVOID
            </span>
            <p className="text-xs text-[#D5D5D5] mt-0.5 leading-snug">{commonMistake}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
