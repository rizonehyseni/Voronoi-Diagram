export const regionColors = [
  "#cb0095",
  "#3db92d",
  "#acb5ff",
  "#8deafb",
  "#0e16fa",
  "#eeff35",
  "#176b04",
  "#b41414",
  "#f8caf7",
  "#ffa7e7",
  "#9eff92",
  "#d8c08f",
  "#d028ff",
  "#7aca68",
  "#ff4d4d",
  "#7fd4fb",
  "#ff9b54",
];

export function getRegionColor(index: number): string {
  return regionColors[index % regionColors.length];
}
