import React, { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { getEnvironmentalField } from '../../data/mockEnvironmental';

interface VectorFlowCanvasProps {
  map: MapLibreMap | null;
}

export const VectorFlowCanvas: React.FC<VectorFlowCanvasProps> = ({ map }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { layers, getActiveIncident } = usePoseidonStore();
  const activeIncident = getActiveIncident();

  useEffect(() => {
    if (!map || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particleOffset = 0;

    const resizeCanvas = () => {
      const container = map.getContainer();
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    map.on('resize', resizeCanvas);

    // Compute vectors around active incident
    const envField = getEnvironmentalField(
      activeIncident.coordinates,
      activeIncident.signature.ambient_current_direction_deg,
      activeIncident.signature.ambient_current_knots,
      activeIncident.signature.ambient_wind_direction_deg,
      activeIncident.signature.ambient_wind_knots
    );

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particleOffset = (particleOffset + 0.01) % 1;

      // 1. Subtle Ocean Current Vectors (Scientific Muted Blue)
      if (layers.ocean_currents) {
        ctx.strokeStyle = 'rgba(23, 105, 170, 0.5)';
        ctx.fillStyle = 'rgba(23, 105, 170, 0.7)';
        ctx.lineWidth = 1.0;

        envField.currentVectors.forEach((vec, idx) => {
          const pStart = map.project([vec.start.lng, vec.start.lat]);
          const pEnd = map.project([vec.end.lng, vec.end.lat]);

          if (
            pStart.x < -50 || pStart.x > canvas.width + 50 ||
            pStart.y < -50 || pStart.y > canvas.height + 50
          ) {
            return;
          }

          const dx = pEnd.x - pStart.x;
          const dy = pEnd.y - pStart.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          if (length < 4) return;

          // Draw vector line
          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(dy, dx);
          const arrowSize = Math.min(5, length * 0.3);
          ctx.beginPath();
          ctx.moveTo(pEnd.x, pEnd.y);
          ctx.lineTo(
            pEnd.x - arrowSize * Math.cos(angle - Math.PI / 6),
            pEnd.y - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            pEnd.x - arrowSize * Math.cos(angle + Math.PI / 6),
            pEnd.y - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        });
      }

      // 2. Subtle Wind Vectors (Scientific Muted Gray dashed)
      if (layers.wind_vectors) {
        ctx.strokeStyle = 'rgba(107, 114, 128, 0.4)';
        ctx.fillStyle = 'rgba(107, 114, 128, 0.6)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 3]);

        envField.windVectors.forEach((vec) => {
          const pStart = map.project([vec.start.lng, vec.start.lat]);
          const pEnd = map.project([vec.end.lng, vec.end.lat]);

          if (
            pStart.x < -50 || pStart.x > canvas.width + 50 ||
            pStart.y < -50 || pStart.y > canvas.height + 50
          ) {
            return;
          }

          const dx = pEnd.x - pStart.x;
          const dy = pEnd.y - pStart.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          if (length < 5) return;

          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        });

        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      map.off('resize', resizeCanvas);
    };
  }, [
    map,
    layers.ocean_currents,
    layers.wind_vectors,
    activeIncident.id,
    activeIncident.coordinates,
    activeIncident.signature.ambient_current_direction_deg,
    activeIncident.signature.ambient_current_knots,
    activeIncident.signature.ambient_wind_direction_deg,
    activeIncident.signature.ambient_wind_knots,
  ]);

  if (!layers.ocean_currents && !layers.wind_vectors) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
