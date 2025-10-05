import React from 'react';

type Props = { size?: number; stroke?: number; progress: number; color?: string };

export function ProgressRing({ size = 72, stroke = 8, progress, color = 'var(--brand)' }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  return (
    <svg width={size} height={size} role="img" aria-label={`Progress ${Math.round(progress * 100)}%`}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--border)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
