export const regionColors = [
  "#cb0095", 
  "#16b401", 
  "#c45c3c", 
  "#9064ff", 
  "#0e16fa", 
  "#eeff35", 
  "#21b200",
  "#dd0000",
];

export function getRegionColor(index: number): string {
  return regionColors[index % regionColors.length];
}