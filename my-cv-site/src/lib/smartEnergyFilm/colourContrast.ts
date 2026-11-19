type Channels = readonly [number, number, number];

const channelsOf = (hex: string): Channels => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)) as unknown as Channels;

const linear = (value: number): number => {
  const share = value / 255;
  return share <= 0.03928 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string): number => {
  const [red, green, blue] = channelsOf(hex);
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
};

export const blendOver = (foreground: string, background: string, opacity: number): string => {
  const front = channelsOf(foreground);
  const back = channelsOf(background);
  const mixed = front.map((value, index) => Math.round(value * opacity + back[index] * (1 - opacity)));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
};

export const contrastRatio = (first: string, second: string): number => {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};
