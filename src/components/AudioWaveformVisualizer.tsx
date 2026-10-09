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
        // Subtle ambient pulsation when idle
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(Date.now() * 0.003 + i * 0.25) * 8 + 12;
        }
      }

      if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.32;
        const bars = 48;
        const step = (Math.PI * 2) / bars;

        // Outer glow on warm beige canvas
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.3,
          centerX,
          centerY,
          radius * 1.55
        );
        if (isSpeaking) {
          gradient.addColorStop(0, 'rgba(4, 120, 87, 0.25)'); // Emerald 700
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)'); // Emerald 500
          gradient.addColorStop(1, 'rgba(250, 248, 245, 0)');
        } else if (isActive) {
          gradient.addColorStop(0, 'rgba(5, 150, 105, 0.2)');
          gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.08)');
          gradient.addColorStop(1, 'rgba(250, 248, 245, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(214, 211, 209, 0.25)');
          gradient.addColorStop(1, 'rgba(250, 248, 245, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Circular frequency spikes in emerald palette
        for (let i = 0; i < bars; i++) {
          const index = Math.floor((i / bars) * (bufferLength / 2));
          const val = dataArray[index] || 10;
          const barHeight = Math.max(5, (val / 255) * (radius * 0.8));

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
            // Radiant emerald gradient
            ctx.strokeStyle = `hsl(${155 + (i % 6) * 4}, 75%, ${36 + (i % 4) * 5}%)`;
          } else if (isActive) {
            ctx.strokeStyle = `hsl(158, 65%, ${42 + (i % 3) * 6}%)`;
          } else {
            ctx.strokeStyle = 'rgba(168, 162, 158, 0.45)'; // Stone 400
          }

          ctx.stroke();
        }

        // Inner core circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.86, 0, Math.PI * 2);
        ctx.fillStyle = isSpeaking ? '#064E3B' : isActive ? '#065F46' : '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isSpeaking ? '#34D399' : isActive ? '#10B981' : '#E7E5E4';
        ctx.stroke();
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
      className="mx-auto rounded-full drop-shadow-md"
    />
  );
};
