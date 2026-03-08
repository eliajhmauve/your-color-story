import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, Download, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { generateColorReport, type ColorResult } from '@/lib/colorGenerator';
import ColorReportCard from '@/components/ColorReportCard';
import { toast } from 'sonner';

const Index = () => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date>();
  const [result, setResult] = useState<ColorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!name.trim() || !birthday) return;
    setIsGenerating(true);
    // Fake delay for dramatic effect
    setTimeout(() => {
      const report = generateColorReport(name.trim(), birthday);
      setResult(report);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0a0a0f',
      });
      const link = document.createElement('a');
      link.download = `${result?.name}-色彩報告.png`;
      link.href = dataUrl;
      link.click();
      toast.success('圖片已下載！');
    } catch {
      toast.error('下載失敗，請嘗試截圖');
    }
  };

  const getShareImageUrl = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      return await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#0a0a0f' });
    } catch {
      return null;
    }
  };

  const handleShareLine = async () => {
    const text = encodeURIComponent(`我的主色是${result?.colorName}！快來看看你的專屬色彩 🎨`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://social-plugins.line.me/lineit/share?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareIG = async () => {
    const dataUrl = await getShareImageUrl();
    if (!dataUrl) {
      toast.error('圖片生成失敗');
      return;
    }
    const blob = await (await fetch(dataUrl)).blob();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${result?.name} 的個人色彩報告`,
          files: [new File([blob], 'color-report.png', { type: 'image/png' })],
        });
      } catch {
        toast.error('分享失敗，請嘗試截圖分享');
      }
    } else {
      // Fallback: download image for manual IG upload
      const link = document.createElement('a');
      link.download = `${result?.name}-色彩報告.png`;
      link.href = dataUrl;
      link.click();
      toast.success('圖片已下載，請手動上傳到 IG Story');
    }
  };

  const handleReset = () => {
    setResult(null);
    setName('');
    setBirthday(undefined);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md mx-auto space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          <ColorReportCard ref={cardRef} result={result} />

          <motion.div
            className="flex gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2.0 }}
          >
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="gap-2 rounded-full px-6"
            >
              <Download className="w-4 h-4" />
              下載圖片
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              className="gap-2 rounded-full px-6"
            >
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 2.3 }}
          >
            <Button
              onClick={handleReset}
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
              重新測驗
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, hsl(270 60% 30%) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(200 60% 25%) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3" style={{ animation: 'fade-up 0.8s ease-out forwards' }}>
          <div className="inline-block mb-2">
            <div className="w-16 h-16 mx-auto rounded-2xl rotate-12" style={{
              background: 'linear-gradient(135deg, hsl(340 70% 55%), hsl(270 60% 50%), hsl(200 70% 50%))',
            }} />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            你的個人色彩報告
          </h1>
          <p className="text-muted-foreground text-sm">
            輸入生日與姓名，發現你的專屬色彩
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5" style={{ animation: 'fade-up 0.8s ease-out 0.2s forwards', opacity: 0 }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">你的名字</label>
            <Input
              placeholder="輸入你的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">你的生日</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full h-12 justify-start text-left font-normal bg-secondary border-0 rounded-xl hover:bg-secondary/80',
                    !birthday && 'text-muted-foreground/50'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, 'yyyy 年 M 月 d 日', { locale: zhTW }) : '選擇你的生日'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="center">
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  disabled={(date) => date > new Date()}
                  defaultMonth={birthday || new Date(2000, 0)}
                  captionLayout="dropdown-buttons"
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!name.trim() || !birthday || isGenerating}
            className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300"
            style={{
              background: name.trim() && birthday
                ? 'linear-gradient(135deg, hsl(340 70% 55%), hsl(270 60% 50%))'
                : undefined,
            }}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                生成中...
              </span>
            ) : (
              '✨ 生成我的色彩報告'
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50" style={{ animation: 'fade-up 0.8s ease-out 0.4s forwards', opacity: 0 }}>
          你的色彩由生日與姓名獨特組合而成
        </p>
      </div>
    </div>
  );
};

export default Index;
