import React, { useEffect, useRef } from 'react';

interface AudioWaveformVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  isSpeaking: boolean;
  mode?: 'bars' | 'circular';
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  analyser,
  isActive,
  isSpeaking,
  mode = 'circular',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Idle gentle breathing pulsation
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(Date.now() * 0.003 + i * 0.2) * 12 + 14;
        }
      }

      if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.32;
        const bars = 48;
        const step = (Math.PI * 2) / bars;

        // Outer glow
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.4, centerX, centerY, radius * 1.5);
        if (isSpeaking) {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
          gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.2)');
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else if (isActive) {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
          gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(148, 163, 184, 0.15)');
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Circular frequency spikes
        for (let i = 0; i < bars; i++) {
          const index = Math.floor((i / bars) * (bufferLength / 2));
          const val = dataArray[index] || 10;
          const barHeight = Math.max(6, (val / 255) * (radius * 0.75));

          const angle = i * step - Math.PI / 2;
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + barHeight);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';

          if (isSpeaking) {
            ctx.strokeStyle = `hsl(${220 + (i / bars) * 60}, 90%, 65%)`;
          } else if (isActive) {
            ctx.strokeStyle = `hsl(${160 + (i / bars) * 40}, 85%, 60%)`;
          } else {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
          }

          ctx.stroke();
        }

        // Inner core circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.88, 0, Math.PI * 2);
        ctx.fillStyle = isSpeaking ? '#1e1b4b' : isActive ? '#064e3b' : '#0f172a';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isSpeaking ? '#818cf8' : isActive ? '#34d399' : '#334155';
        ctx.stroke();
      } else {
        // Linear horizontal visualizer bars
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;
        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = ((dataArray[i] || 5) / 255) * height * 0.8;
          ctx.fillStyle = isSpeaking ? '#818cf8' : isActive ? '#34d399' : '#64748b';
          ctx.fillRect(x, (height - barHeight) / 2, barWidth - 2, barHeight);
          x += barWidth;
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser, isActive, isSpeaking, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="mx-auto rounded-full drop-shadow-2xl"
    />
  );
};
