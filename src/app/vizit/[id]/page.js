/* Bacar.az — Portfolio Görüntüleme Sayfası */
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPortfolioById } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import PortfolioTemplate from '@/components/vizit/PortfolioTemplate';

export default function PortfolioViewPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const data = getPortfolioById(id);
    setPortfolio(data);
    setLoading(false);
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link kopyalandı! 📋', 'success');
  };

  const downloadPDF = async () => {
    try {
      addToast('PDF hazırlanır...', 'info');
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = document.getElementById('portfolio-content');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0A0A0A' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, w, h);
      pdf.save(`vizit-${portfolio.name}-${portfolio.surname}.pdf`);
      addToast('PDF yükləndi! 📄', 'success');
    } catch (err) {
      addToast('PDF yaradılarkən xəta baş verdi', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Portfolio tapılmadı</h2>
          <p className="text-[var(--text-secondary)]">Bu ID ilə portfolio mövcud deyil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Action Bar */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">🎯 Vizit Portfolio</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={copyLink} icon="📋">Linki kopyala</Button>
            <Button variant="primary" size="sm" onClick={downloadPDF} icon="📄">PDF yüklə</Button>
          </div>
        </motion.div>

        {/* Portfolio */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <PortfolioTemplate data={portfolio} colorIndex={portfolio.colorIndex || 0} />
        </motion.div>

        {/* Paylaşım Linki */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="mt-6 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Paylaşım linki:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] text-sm text-brand-blue truncate">
              {typeof window !== 'undefined' ? window.location.href : `bacar.az/vizit/${id}`}
            </code>
            <Button variant="ghost" size="sm" onClick={copyLink}>Kopyala</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
