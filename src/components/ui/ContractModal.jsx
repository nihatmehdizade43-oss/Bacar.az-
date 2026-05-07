'use client';
/* =================================================
   ContractModal — Bölməyə xas müqavilə imzalama
   ================================================= */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTRACTS = {
  bacar: {
    title: '💼 BACAR Freelance — İstifadəçi Müqaviləsi',
    clauses: [
      'Mən bu platformada yalnız öz bacarıq və xidmətlərimi təklif edirəm.',
      'Müştəri ilə razılaşdırılmış işi vaxtında və keyfiyyətlə yerinə yetirəcəyəmi bəyan edirəm.',
      'Bacar.az platformasını yan keçərək birbaşa ödəniş tələb etməyəcəyimi öhdəsinə götürürəm.',
      'Saxta elan, aldatma, spam fəaliyyəti həyata keçirməyəcəyimi bəyan edirəm.',
      'Qeydiyyat zamanı daxil etdiyim məlumatların həqiqiliyini təsdiqləyirəm.',
      'Bacar.az istifadə şərtlərini oxumuş, başa düşmüş və qəbul etmişəm.',
    ],
  },
  ortaq: {
    title: '🤝 ORTAQ — Şəriklər Müqaviləsi',
    clauses: [
      'Bu elanı potensial biznes şəriki axtarmaq məqsədilə yerləşdirirəm.',
      'Ortaqlıq təklifi ciddi, real və icra edilə bilən əsasda qurulmuşdur.',
      'Potensial şərikləri yanıltmayan, şəffaf məlumat verəcəyimi öhdəsinə götürürəm.',
      'Bacar.az platformasını yan keçərək birbaşa kommersiya tənzimləmələri qurmayacağımı bəyan edirəm.',
      'Zərər verici, saxta və ya qeyri-qanuni şəriklər üçün elan verməyəcəyimi qəbul edirəm.',
      'Bacar.az istifadə şərtlərini tam oxuyub qəbul etmişəm.',
    ],
  },
  rehber: {
    title: '🎓 RƏHBƏR — Mentorluq Müqaviləsi',
    clauses: [
      'Mentor olaraq təqdim etdiyim sahə, təcrübə və bacarıqlar tamamilə həqiqidir.',
      'Mentorluq xidmətlərimi peşəkar etika çərçivəsində həyata keçirəcəyimi bəyan edirəm.',
      'Mentee-lərimə zərər verən, yanlış yönləndirən məsləhət verməyəcəyimi öhdəsinə götürürəm.',
      'Şəxsi məlumatları gizli saxlayacağımı, sui-istifadə etməyəcəyimi qəbul edirəm.',
      'Bacar.az-ın yanlış mentor profili üçün hesabı silmə hüququnu tanıyıram.',
      'Bu müqaviləni imzalamaqla mentor kimi RƏHBƏR bölməsindəki qaydalara tabe olmağı qəbul edirəm.',
    ],
  },
  layihe: {
    title: '🚀 LAYİHƏ — Layihə Marketpleysı Müqaviləsi',
    clauses: [
      'Elan etdiyim layihə real, icra edilə bilən və qanuni çərçivədədir.',
      'Layihə üçün cəlb edilən iştirakçıların haqqını vaxtında ödəyəcəyimi öhdəsinə götürürəm.',
      'Layihə məlumatlarını şəffaf şəkildə təqdim etdiyimi bəyan edirəm.',
      'Bacar.az platformasını yan keçərək iştirakçılarla kənar sövdələşmə yaratmayacağımı qəbul edirəm.',
      'Saxta investisiya, piramida, yaxud qeyri-qanuni layihə bildirmərəm.',
      'Bacar.az istifadə şərtlərini tam oxuyub qəbul etmişəm.',
    ],
  },
  vizit: {
    title: '✨ VİZİT — AI Portfolio Müqaviləsi',
    clauses: [
      'Portfolio-mda yerləşdirdiyim iş nümunələri mənimdir və ya istifadəsinə icazəm var.',
      'Başqasının işini öz işim kimi təqdim etməyəcəyimi bəyan edirəm.',
      'Portfolio məlumatlarının həqiqiliyini təsdiqləyirəm.',
      'Müştərini yanıltmaq üçün AI-ilə saxta nümunə yaratmayacağımı qəbul edirəm.',
      'Bacar.az-ın saxta portfoliolara qarşı hesabı dayandırma hüququnu tanıyıram.',
      'Bacar.az istifadə şərtlərini tam oxuyub qəbul etmişəm.',
    ],
  },
};

export default function ContractModal({ section = 'bacar', onAccept, onClose }) {
  const [scrolled, setScrolled] = useState(false);
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const contract = CONTRACTS[section] || CONTRACTS.bacar;

  function handleScroll(e) {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setScrolled(true);
  }

  function handleAccept() {
    if (!scrolled || !signature.trim() || !agreed) return;
    onAccept({ signature, signedAt: new Date().toISOString() });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-gradient-to-r from-brand-blue/10 to-transparent">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{contract.title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Elan yerləşdirməzdən əvvəl bu müqaviləni oxuyub imzalamalısınız
            </p>
          </div>

          {/* Contract Body — scrollable */}
          <div
            onScroll={handleScroll}
            className="max-h-72 overflow-y-auto px-6 py-4 space-y-3"
          >
            <p className="text-xs text-[var(--text-muted)] italic">
              Bu müqavilə Bacar.az platformasında {contract.title} bölməsindəki fəaliyyətinizi tənzimləyir.
              Aşağıdakı bəndləri diqqətlə oxuyun:
            </p>
            <ol className="space-y-3">
              {contract.clauses.map((clause, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {clause}
                </li>
              ))}
            </ol>
            <div className="h-4 text-center text-xs text-[var(--text-muted)]">
              {!scrolled && '↓ Davam etmək üçün aşağı diyirləyin'}
            </div>
          </div>

          {/* Signature Area */}
          <div className="px-6 py-4 border-t border-[var(--border-color)] space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Tam adınızı yazın (elektron imza):
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Ad Soyad"
                disabled={!scrolled}
                className="mt-1 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-40"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!scrolled}
                className="mt-0.5 accent-brand-blue disabled:opacity-40"
              />
              <span className="text-xs text-[var(--text-secondary)]">
                Yuxarıdakı bütün bəndləri oxudum, anladım və tam qəbul edirəm.
                Bu müqavilənin hüquqi qüvvəsi olduğunu başa düşürəm.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-[var(--border-color)] py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Ləğv et
              </button>
              <button
                onClick={handleAccept}
                disabled={!scrolled || !signature.trim() || !agreed}
                className="flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✍️ İmzala və Davam et
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
