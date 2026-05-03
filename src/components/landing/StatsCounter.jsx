/* ============================================
   Bacar.az — Stats Counter Section
   ============================================ */
'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { value: 150, suffix: '+', label: 'Freelancer', icon: '👨‍💻', color: 'text-brand-blue' },
  { value: 80, suffix: '+', label: 'İş Elanı', icon: '💼', color: 'text-brand-green' },
  { value: 12, suffix: '+', label: 'Mentor', icon: '🧭', color: 'text-brand-gold' },
  { value: 230, suffix: '+', label: 'Portfolio', icon: '🎯', color: 'text-purple-500' },
];

function StatItem({ stat, index }) {
  const { count, ref } = useCountUp(stat.value, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="text-center p-6"
    >
      <span className="text-4xl mb-3 block">{stat.icon}</span>
      <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-2`}>
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-[var(--text-secondary)] font-medium">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-4 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
