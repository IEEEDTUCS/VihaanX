export type ScoreValue = { key: string; score: number };

export type NormalizedValue = ScoreValue & {
  mean: number;
  standardDeviation: number;
  zScore: number;
};

export const normalizeScores = (values: readonly ScoreValue[]): NormalizedValue[] => {
  if (values.length === 0) return [];

  const mean = values.reduce((sum, value) => sum + value.score, 0) / values.length;
  const standardDeviation = Math.sqrt(
    values.reduce((sum, value) => sum + (value.score - mean) ** 2, 0) /
      values.length,
  );

  return values.map((value) => ({
    ...value,
    mean,
    standardDeviation,
    zScore:
      standardDeviation === 0 ? 0 : (value.score - mean) / standardDeviation,
  }));
};
