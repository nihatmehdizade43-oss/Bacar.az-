/* Bacar.az — Vizit Generator Sayfası */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from '@/lib/utils';
import { savePortfolio } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TagInput from '@/components/vizit/TagInput';
import PortfolioTemplate from '@/components/vizit/PortfolioTemplate';

const STEPS = [
  { number: 1, title: 'Şəxsi məlumatlar' },
  { number: 2, title: 'Bacarıq və əlaqələr' },
  { number: 3, title: 'Media və önizləmə' },
];

export default function VizitPage() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [formData, setFormData] = useState({
    name: '', surname: '', title: '', email: '', phone: '', bio: '',
    skills: [], experience: '', linkedin: '', github: '', portfolioUrl: '',
    education: '', certificates: '', template: 'minimal',
    avatar: null, portfolioImages: [], cv: null,
  });
  const router = useRouter();
  const { addToast } = useToast();
  const update = (f, v) => setFormData(p => ({ ...p, [f]: v }));

  const canNext = () => {
    if (step === 1) return formData.name && formData.surname;
    if (step === 2) return formData.skills.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1000));
    const id = generateId();
    savePortfolio({ id, ...formData, createdAt: new Date().toISOString() });
    addToast('Portfolio uğurla yaradıldı!', 'success');
    router.push(`/vizit/${id}`);
  };

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/vizit`;
    await navigator.clipboard.writeText(shareUrl);
    addToast('Link kopyalandı', 'info');
  };

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-3">
            🎯 <span className="gradient-text-blue">Vizit</span> — Portfolio
          </h1>
          <p className="text-[var(--text-secondary)]">Sadə, sürətli və paylaşıla bilən portfolio</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <span key={s.number} className={`px-3 py-1.5 rounded-full text-sm ${step >= s.number ? 'bg-brand-blue/15 text-brand-blue' : 'text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-color)]'}`}>
              {s.number}. {s.title}
            </span>
          ))}
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-xl fade-in-up">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Şəxsi məlumatlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Ad" value={formData.name} onChange={e=>update('name',e.target.value)} required />
                <Input label="Soyad" value={formData.surname} onChange={e=>update('surname',e.target.value)} required />
              </div>
              <Input label="Peşə" value={formData.title} onChange={e=>update('title',e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="E-poçt" type="email" value={formData.email} onChange={e=>update('email',e.target.value)} />
                <Input label="Telefon" value={formData.phone} onChange={e=>update('phone',e.target.value)} />
              </div>
              <Input label="Haqqınızda" value={formData.bio} onChange={e=>update('bio',e.target.value)} textarea rows={3} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Bacarıq və əlaqələr</h2>
              <TagInput tags={formData.skills} onChange={s=>update('skills',s)} />
              <Input label="Təcrübə" value={formData.experience} onChange={e=>update('experience',e.target.value)} textarea rows={4} />
              <Input label="LinkedIn" value={formData.linkedin} onChange={e=>update('linkedin',e.target.value)} placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub" value={formData.github} onChange={e=>update('github',e.target.value)} placeholder="https://github.com/..." />
              <Input label="Portfolio link" value={formData.portfolioUrl} onChange={e=>update('portfolioUrl',e.target.value)} />
              <Input label="Təhsil" value={formData.education} onChange={e=>update('education',e.target.value)} />
              <Input label="Sertifikatlar" value={formData.certificates} onChange={e=>update('certificates',e.target.value)} textarea rows={3} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Media və önizləmə</h2>
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">Avatar yüklə</label>
                <input type="file" accept="image/*" onChange={(e)=>update('avatar', e.target.files?.[0]?.name || null)} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">Portfolio şəkilləri</label>
                <input type="file" multiple accept="image/*" onChange={(e)=>update('portfolioImages', Array.from(e.target.files || []).map(f => f.name))} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">CV yüklə (PDF)</label>
                <input type="file" accept="application/pdf" onChange={(e)=>update('cv', e.target.files?.[0]?.name || null)} />
              </div>
              <div>
                <p className="text-sm mb-2 text-[var(--text-secondary)]">Şablon seç</p>
                <div className="flex flex-wrap gap-2">
                  {['minimal', 'creative', 'professional'].map((template) => (
                    <button key={template} onClick={() => update('template', template)} className={`px-3 py-2 rounded-xl border ${formData.template===template?'border-brand-blue text-brand-blue':'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                      {template}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPreviewDevice('desktop')} className={`px-3 py-1.5 rounded-lg border ${previewDevice==='desktop'?'border-brand-blue text-brand-blue':'border-[var(--border-color)]'}`}>Desktop</button>
                <button onClick={() => setPreviewDevice('mobile')} className={`px-3 py-1.5 rounded-lg border ${previewDevice==='mobile'?'border-brand-blue text-brand-blue':'border-[var(--border-color)]'}`}>Mobile</button>
              </div>
              <div className={previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}>
                <PortfolioTemplate data={formData} colorIndex={formData.template === 'minimal' ? 0 : formData.template === 'creative' ? 2 : 4} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleCopy}>Copy link</Button>
              </div>
              {generating && <p className="text-brand-blue text-sm">Yaradılır...</p>}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
            {step > 1 ? <Button variant="ghost" onClick={()=>setStep(p=>p-1)} disabled={generating}>← Geri</Button> : <div />}
            {step < 3
              ? <Button variant="primary" onClick={()=>setStep(p=>p+1)} disabled={!canNext()}>Növbəti →</Button>
              : <Button variant="success" size="lg" onClick={handleGenerate} loading={generating}>Portfolionu yarat</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
