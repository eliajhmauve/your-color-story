import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import type { ColorResult } from '@/lib/colorGenerator';

interface Props {
  result: ColorResult;
}

const ColorReportCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { primaryColor, palette, colorName, meaning, energyColorName, name } = result;
  const primaryHsl = `hsl(${primaryColor.h}, ${primaryColor.s}%, ${primaryColor.l}%)`;

  const isLight = primaryColor.l > 55;
  const textColor = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';
  const textColorMuted = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)';

  return (
    <div
      ref={ref}
      className="rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: 'hsl(240, 10%, 6%)' }}
    >
      {/* Primary color block */}
      <div
        className="relative px-6 pt-8 pb-10"
        style={{
          background: `linear-gradient(160deg, ${primaryHsl}, hsl(${(primaryColor.h + 20) % 360}, ${primaryColor.s - 5}%, ${primaryColor.l - 8}%))`,
          minHeight: '280px',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 space-y-4">
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: textColorMuted }}>
              Personal Color Report
            </p>
            <h2 className="text-2xl font-bold font-display" style={{ color: textColor }}>
              {name}
            </h2>
            <p className="text-xs" style={{ color: textColorMuted }}>
              {format(result.birthday, 'yyyy.MM.dd', { locale: zhTW })}
            </p>
          </motion.div>

          <motion.div
            className="pt-6 space-y-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 120 }}
          >
            <p className="text-4xl font-bold font-display tracking-tight" style={{ color: textColor }}>
              {colorName}
            </p>
            <motion.p
              className="text-sm leading-relaxed max-w-[280px]"
              style={{ color: textColorMuted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              代表{meaning.trait}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Color personality section */}
      <div className="px-6 py-5 space-y-4" style={{ background: 'hsl(240, 10%, 6%)' }}>
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <p className="text-sm leading-relaxed text-foreground/80">
            「你的主色是 <strong className="text-foreground">{colorName}</strong> — 代表{meaning.trait}」
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            「你的能量色是 <strong className="text-foreground">{energyColorName}</strong> — {meaning.energy}」
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground mt-2">
            {meaning.description}
          </p>
        </motion.div>

        {/* 4-color palette strip */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {palette.map((color, i) => (
            <motion.div
              key={i}
              className="space-y-1.5"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.15, type: 'spring', stiffness: 150 }}
            >
              <div
                className="aspect-square rounded-xl"
                style={{
                  background: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                }}
              />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">{color.label}</p>
                <p className="text-[10px] font-mono text-foreground/60">{color.hex.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Watermark */}
        <motion.div
          className="pt-3 border-t border-border/30 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <p className="text-[10px] text-muted-foreground/40">你的個人色彩報告</p>
          <p className="text-[10px] text-muted-foreground/40">colorpalette.app</p>
        </motion.div>
      </div>
    </div>
  );
});

ColorReportCard.displayName = 'ColorReportCard';
export default ColorReportCard;
