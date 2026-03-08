// Month-based hue mapping (1-12)
const MONTH_HUES: Record<number, number> = {
  1: 210,   // 藍色
  2: 270,   // 紫色
  3: 140,   // 綠色
  4: 160,   // 青綠
  5: 50,    // 黃色
  6: 20,    // 橘色
  7: 0,     // 紅色
  8: 340,   // 玫瑰
  9: 30,    // 珊瑚橘
  10: 180,  // 青色
  11: 250,  // 靛藍
  12: 300,  // 洋紅
};

const COLOR_NAMES: Record<number, string> = {
  1: '冰晶藍',
  2: '夢幻紫',
  3: '森林綠',
  4: '薄荷青',
  5: '琥珀金',
  6: '落日橘',
  7: '烈焰紅',
  8: '玫瑰粉',
  9: '珊瑚橘',
  10: '深海青',
  11: '星空靛',
  12: '仙境紫',
};

const COLOR_MEANINGS: Record<number, { trait: string; energy: string; description: string }> = {
  1: { trait: '冷靜、智慧和深邃', energy: '在混亂中保持清醒的力量', description: '你像冬日的天空，外表沉靜卻蘊含無限深度。你的直覺敏銳，總能在紛擾中找到真相。' },
  2: { trait: '神秘、直覺和靈性', energy: '連結內在智慧的橋樑', description: '你擁有與眾不同的洞察力，能看穿事物的本質。你的存在本身就帶有一種迷人的磁場。' },
  3: { trait: '成長、和諧和生命力', energy: '帶來新生與希望的能量', description: '你是天生的療癒者，走到哪裡就把生機帶到哪裡。你的樂觀和韌性讓周圍的人感到安心。' },
  4: { trait: '清新、自由和創新', energy: '打破框架的突破力', description: '你像一陣清風，帶來嶄新的視角和可能性。你不受傳統束縛，總能找到獨特的解決方案。' },
  5: { trait: '溫暖、自信和光芒', energy: '照亮他人前路的光', description: '你天生就是舞台的焦點，不是因為刻意，而是因為你散發的真誠光芒無法被忽視。' },
  6: { trait: '溫暖、創造力和冒險精神', energy: '點燃熱情的火焰', description: '你是行動派的夢想家，將想像力化為現實的力量驚人。你的熱情具有感染力，能帶動整個團隊前進。' },
  7: { trait: '熱情、勇氣和領導力', energy: '衝破一切障礙的決心', description: '你擁有不可阻擋的意志力和魄力。當別人猶豫不前時，你已經在開拓新的道路。' },
  8: { trait: '浪漫、溫柔和共感力', energy: '溫暖人心的療癒力', description: '你擁有罕見的同理心，能夠感受到他人未說出口的情感。你的溫柔不是軟弱，而是最強大的力量。' },
  9: { trait: '活力、樂觀和社交魅力', energy: '創造歡樂氛圍的魔力', description: '你是天生的氛圍製造者，你的笑容和能量能瞬間點亮任何空間。人們被你的真誠和活力所吸引。' },
  10: { trait: '沉穩、深邃和包容', energy: '在迷茫時帶來平靜', description: '你像深海一樣，表面平靜卻擁有無窮的力量和智慧。你的沉穩讓身邊的人感到安全和被理解。' },
  11: { trait: '夢想、洞察和遠見', energy: '穿越黑暗找到方向的光', description: '你是天生的遠見者，能看到別人看不到的未來。你的想像力和決斷力讓夢想成為可能。' },
  12: { trait: '優雅、轉化和神秘', energy: '將平凡變為非凡的魔法', description: '你身上有一種難以言喻的魅力，能將任何場合變得特別。你的品味和直覺總是走在時代前面。' },
};

function getNameValue(name: string): number {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total += name.charCodeAt(i);
  }
  return total;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface ColorResult {
  name: string;
  birthday: Date;
  primaryColor: { h: number; s: number; l: number; hex: string };
  palette: Array<{ h: number; s: number; l: number; hex: string; label: string }>;
  colorName: string;
  meaning: { trait: string; energy: string; description: string };
  energyColorName: string;
}

export function generateColorReport(name: string, birthday: Date): ColorResult {
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();
  const year = birthday.getFullYear();
  const nameValue = getNameValue(name);

  // Primary hue from month, with day offset
  const baseHue = MONTH_HUES[month];
  const hueOffset = (day - 15) * 1.5; // -21 to +24
  const primaryHue = (baseHue + hueOffset + 360) % 360;

  // Saturation from year (40-60 range for softer, more elegant colors)
  const saturation = 40 + ((year % 100) % 20);

  // Lightness from name (42-58 for balanced, non-fluorescent tones)
  const lightness = 42 + (nameValue % 16);

  const primaryColor = {
    h: Math.round(primaryHue),
    s: saturation,
    l: lightness,
    hex: hslToHex(primaryHue, saturation, lightness),
  };

  // Generate complementary/analogous colors
  const palette = [
    { ...primaryColor, label: '主色' },
    {
      h: Math.round((primaryHue + 30) % 360),
      s: Math.max(35, saturation - 15),
      l: Math.min(70, lightness + 10),
      hex: hslToHex((primaryHue + 30) % 360, Math.max(35, saturation - 15), Math.min(70, lightness + 10)),
      label: '輔色',
    },
    {
      h: Math.round((primaryHue + 180) % 360),
      s: Math.max(30, saturation - 20),
      l: Math.min(65, lightness + 5),
      hex: hslToHex((primaryHue + 180) % 360, Math.max(30, saturation - 20), Math.min(65, lightness + 5)),
      label: '能量色',
    },
    {
      h: Math.round((primaryHue + 210) % 360),
      s: Math.max(25, saturation - 25),
      l: Math.min(75, lightness + 15),
      hex: hslToHex((primaryHue + 210) % 360, Math.max(25, saturation - 25), Math.min(75, lightness + 15)),
      label: '靈感色',
    },
  ];

  // Energy color name (complementary month)
  const energyMonth = ((month + 5) % 12) + 1;

  return {
    name,
    birthday,
    primaryColor,
    palette,
    colorName: COLOR_NAMES[month],
    meaning: COLOR_MEANINGS[month],
    energyColorName: COLOR_NAMES[energyMonth],
  };
}
