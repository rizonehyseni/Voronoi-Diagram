export const regionColors = [
  "#cb0095", 
  "#3db92d", 
  "#acb5ff", 
  "#8deafbf4", 
  "#0e16fa", 
  "#eeff35", 
  "#176b04",
  "#b41414",
  "#f8caf7"
];

export function getRegionColor(index: number): string {
  return regionColors[index % regionColors.length];
}