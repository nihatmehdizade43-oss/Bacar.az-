// Purpose: Anti-bypass message filter — detects and masks contact info in messages.

const PATTERNS: { regex: RegExp; reason: string }[] = [
  // Azerbaijani & international phone numbers
  {
    regex: /(\+?994\s?)?(\(0[5-9]\d\)|0[5-9]\d)[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g,
    reason: "phone",
  },
  {
    regex: /\b0\s?[5-9]\s?\d[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}\b/g,
    reason: "phone",
  },
  // Generic international phone
  {
    regex: /\+\d{1,3}[\s\-]?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{2,4}/g,
    reason: "phone",
  },
  // Email addresses
  {
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    reason: "email",
  },
  // Telegram
  {
    regex: /(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{3,}/gi,
    reason: "telegram",
  },
  // WhatsApp
  {
    regex: /(https?:\/\/)?wa\.me\/\d+/gi,
    reason: "whatsapp",
  },
  // Instagram
  {
    regex: /(https?:\/\/)?instagram\.com\/[a-zA-Z0-9_.]{2,}/gi,
    reason: "instagram",
  },
  // Generic social @handle (standalone)
  {
    regex: /(?<!\w)@[a-zA-Z0-9_]{3,30}(?!\w)/g,
    reason: "social_handle",
  },
  // External URLs (http/https)
  {
    regex: /https?:\/\/[^\s]+/gi,
    reason: "external_link",
  },
];

const REPLACEMENTS: Record<string, string> = {
  phone: "[📵 Nömrə bloklandı — Bacar.az]",
  email: "[📧 Email bloklandı — Bacar.az]",
  telegram: "[🔒 Telegram bloklandı — Bacar.az]",
  whatsapp: "[🔒 WhatsApp bloklandı — Bacar.az]",
  instagram: "[🔒 Instagram bloklandı — Bacar.az]",
  social_handle: "[🔒 İstifadəçi adı bloklandı — Bacar.az]",
  external_link: "[🔗 Xarici link bloklandı — Bacar.az]",
};

export interface FilterResult {
  filteredBody: string;
  flagged: boolean;
  flagReason: string | null;
}

export function filterMessage(body: string): FilterResult {
  let filtered = body;
  let flagged = false;
  const reasons: string[] = [];

  for (const { regex, reason } of PATTERNS) {
    const newFiltered = filtered.replace(regex, REPLACEMENTS[reason]);
    if (newFiltered !== filtered) {
      flagged = true;
      reasons.push(reason);
      filtered = newFiltered;
    }
  }

  return {
    filteredBody: filtered,
    flagged,
    flagReason: reasons.length > 0 ? reasons.join(", ") : null,
  };
}
