// Privacy-first on-device pose guidance stub
// Replace with TensorFlow Lite or MediaPipe integration
export type PoseHint = {
  message: string;
  confidence: number; // 0..1
};

export function evaluatePosture(landmarks: number[]): PoseHint[] {
  // landmarks would be an array of normalized coordinates
  // Simple heuristic placeholder
  const hints: PoseHint[] = [];
  const backStraightness = Math.random();
  if (backStraightness < 0.6) {
    hints.push({ message: 'Straighten your back', confidence: 0.8 });
  }
  const tempo = Math.random();
  if (tempo < 0.4) hints.push({ message: 'Slow down', confidence: 0.7 });
  return hints;
}

export function countRep(previous: number, landmarks: number[]): { reps: number; event?: string } {
  // placeholder: random rep detection
  const trigger = Math.random() > 0.95;
  return { reps: previous + (trigger ? 1 : 0), event: trigger ? 'rep' : undefined };
}
