export const regionColors = [
  "#5f78a8",
  "#6f9a82",
  "#ad7d69",
  "#8275a5",
  "#7193a0",
  "#a28e62",
  "#668e89",
  "#8b6f83",
];

export function getRegionColor(index: number): string {
  return regionColors[index % regionColors.length];
}