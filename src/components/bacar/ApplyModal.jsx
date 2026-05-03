/* Bacar.az — Apply Modal */
'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function ApplyModal({ isOpen, onClose, job }) {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { addToast('Əvvəlcə daxil olun', 'warning'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    addToast('Müraciətiniz göndərildi! ✅', 'success');
    setMessage('');
    setPrice('');
    setCvFile(null);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Müraciət et" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{job?.title}</p>
          <p className="text-xs text-[var(--text-muted)]">Elan sahibi: {job?.posterName}</p>
        </div>
        <Input label="Təklif etdiyiniz qiymət (AZN)" type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="500" required />
        <Input label="Mesajınız" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Niyə bu iş üçün uyğunsunuz?" textarea rows={4} required />
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">CV (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          {cvFile && <p className="text-xs text-[var(--text-muted)] mt-1">{cvFile.name}</p>}
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Ləğv et</Button>
          <Button type="submit" variant="success" loading={loading} className="flex-1">Göndər</Button>
        </div>
      </form>
    </Modal>
  );
}