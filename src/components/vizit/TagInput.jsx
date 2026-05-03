/* ============================================
   Bacar.az — Tag Input Bileşeni (Bacarıqlar)
   ============================================ */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';

const SUGGESTED_SKILLS = [
  'React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'Figma',
  'Photoshop', 'Illustrator', 'JavaScript', 'TypeScript', 'Firebase',
  'MongoDB', 'PostgreSQL', 'UI/UX', 'Branding', 'SEO',
  'İngilis dili', 'Türk dili', 'Rus dili', 'Tərcümə', 'Video Montaj',
  'WordPress', 'HTML/CSS', 'Swift', 'Kotlin', 'Machine Learning',
];

export default function TagInput({ tags = [], onChange, label = 'Bacarıqlar', maxTags = 10 }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = SUGGESTED_SKILLS.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  ).slice(0, 6);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label} <span className="text-[var(--text-muted)]">({tags.length}/{maxTags})</span>
      </label>

      {/* Tag Container */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]
          input-focus min-h-[48px] cursor-text"
        onClick={() => document.getElementById('tag-input')?.focus()}
      >
        <AnimatePresence>
          {tags.map(tag => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge color="blue" size="md" removable onRemove={() => removeTag(tag)}>
                {tag}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        <input
          id="tag-input"
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? 'Bacarıq əlavə edin...' : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Öneriler */}
      <AnimatePresence>
        {showSuggestions && input && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap gap-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]"
          >
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="px-3 py-1 rounded-full text-xs font-medium
                  bg-[var(--bg-card-hover)] text-[var(--text-secondary)]
                  hover:bg-brand-blue/10 hover:text-brand-blue transition-all"
              >
                + {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
