// Purpose: Professional Privacy Policy for Bacar.az (Azərbaycan dili, GDPR uyğun).
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Siyasəti — Bacar.az",
  description: "Bacar.az platformasının gizlilik siyasəti, məlumatların qorunması və istifadəçi hüquqları haqqında tam məlumat.",
};

const LAST_UPDATED = "07 May 2026";
const COMPANY = "Bacar.az";
const EMAIL = "nihatmehdizade43@gmail.com";
const PHONE = "+994 55 322 91 66";
const WHATSAPP = "https://wa.me/994553229166";


export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-brand-blue text-sm font-semibold hover:underline">← Baş səhifəyə qayıt</Link>
          <h1 className="text-4xl font-black text-[var(--text-primary)] mt-4 mb-2">Gizlilik Siyasəti</h1>
          <p className="text-[var(--text-secondary)] text-sm">Son yeniləmə: {LAST_UPDATED}</p>
          <div className="mt-4 p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20 text-sm text-[var(--text-secondary)]">
            Bu siyasət <strong className="text-[var(--text-primary)]">{COMPANY}</strong> platformasında toplanan, istifadə edilən və qorunan şəxsi məlumatları əhatə edir.
            Platformamızdan istifadə etməklə bu siyasətin şərtlərini qəbul etmiş sayılırsınız.
          </div>
        </div>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">

          <Section num="1" title="Topladığımız Məlumatlar">
            <p>Qeydiyyat zamanı aşağıdakı məlumatları topluyuruq:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-[var(--text-primary)]">Ad və soyad</strong> — hesabınızı şəxsiləşdirmək üçün</li>
              <li><strong className="text-[var(--text-primary)]">Email ünvanı</strong> — hesaba giriş və bildirişlər üçün</li>
              <li><strong className="text-[var(--text-primary)]">Şifrə</strong> — şifrələnmiş (bcrypt hash) şəkildə saxlanır, heç vaxt oxunaqlı formada saxlanmır</li>
              <li><strong className="text-[var(--text-primary)]">Profil məlumatları</strong> — şəhər, bacarıqlar, bio (isteğe bağlı)</li>
              <li><strong className="text-[var(--text-primary)]">Google hesabı</strong> — Google ilə giriş etdikdə avtomatik alınır</li>
            </ul>
            <p className="mt-3">Platformadan istifadə zamanı texniki məlumatlar da toplanır:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>IP ünvanı və brauzer növü (güvenlik məqsədilə)</li>
              <li>Platforma daxili fəaliyyət loqları</li>
              <li>Göndərilən mesajlar (filtrəsilə birlikdə)</li>
            </ul>
          </Section>

          <Section num="2" title="Mesaj Filtrəsi və Anti-Bypass Sistemi">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm mb-3">
              ⚠️ Bu bölmə platformamızın əsas qaydalarından birini əhatə edir.
            </div>
            <p>
              {COMPANY} daxili mesajlaşma sistemindəki bütün mesajlar avtomatik filtrə sistemindən keçirilir.
              Bu sistem aşağıdakı məlumat növlərini avtomatik bloklayır:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Telefon nömrələri (+994, 050, 055, 070 və s.)</li>
              <li>Email ünvanları</li>
              <li>Telegram, WhatsApp, Instagram linklər</li>
              <li>Xarici linklər və sosial media istifadəçi adları</li>
            </ul>
            <p className="mt-3">
              <strong className="text-[var(--text-primary)]">Niyə?</strong> Platforma xaricindəki əlaqə məlumatlarının paylaşılması
              platformamızın kommersiya şərtlərini pozur. Belə məlumatlar <code className="bg-[var(--bg-primary)] px-1 rounded">[Bloklandı 🔒]</code> ilə əvəzlənir.
            </p>
            <p className="mt-2">
              Filtrəyə düşən mesajlar admin panelinə şübhəli mesaj kimi qeydə alınır.
              3 dəfə qaydanı pozan istifadəçinin hesabı avtomatik bloklanır.
            </p>
          </Section>

          <Section num="3" title="Escrow (Depozit) Sistemi">
            <p>
              İş müqavilələri zamanı ödənişlər {COMPANY} escrow (depozit) sistemi üzərindən həyata keçirilir:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Müştəri ödənişi iş başlanmazdan platformaya yatırır</li>
              <li>Pul iş tamamlanana qədər platformada bloklanmış vəziyyətdə saxlanılır</li>
              <li>İş müştəri tərəfindən qəbul edildikdə freelancer-ə ödənilir</li>
              <li>{COMPANY} komissiya (%) ödəniş zamanı çıxılır</li>
            </ul>
            <p className="mt-3 text-sm">
              Mübahisəli hallarda admin komandası müdaxilə edə bilər. Geri ödəniş siyasəti ayrıca sənəddə göstərilib.
            </p>
          </Section>

          <Section num="4" title="Məlumatların İstifadəsi">
            <p>Topladığımız məlumatları aşağıdakı məqsədlərlə istifadə edirik:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Hesab yaratma və idarə etmə</li>
              <li>Platforma xidmətlərinin göstərilməsi (iş elanları, mesajlaşma, müqavilələr)</li>
              <li>Platforma qaydalarının tətbiqi (anti-bypass, ban sistemi)</li>
              <li>Email bildirişləri (vacib xəbərdarlıqlar, sistem mesajları)</li>
              <li>Platforma statistikası və inkişafı</li>
            </ul>
            <p className="mt-3">
              Məlumatlarınız heç vaxt üçüncü tərəflərə satılmır, kərə götürülmür.
            </p>
          </Section>

          <Section num="5" title="Məlumatların Qorunması">
            <p>Məlumatlarınızın qorunması üçün aşağıdakı tədbirlər həyata keçirilir:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Şifrələr bcrypt alqoritmi ilə hash edilir</li>
              <li>HTTPS/TLS şifrələnmiş bağlantı</li>
              <li>JWT sessiya tokenleri</li>
              <li>SQL injection qoruması (Prisma ORM)</li>
              <li>Rate limiting və brute-force qoruması</li>
            </ul>
          </Section>

          <Section num="6" title="Cookie Siyasəti">
            <p>Platformamız aşağıdakı cookie-ləri istifadə edir:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-[var(--border-color)] rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-2 text-left font-semibold text-[var(--text-primary)]">Cookie</th>
                    <th className="px-4 py-2 text-left font-semibold text-[var(--text-primary)]">Məqsəd</th>
                    <th className="px-4 py-2 text-left font-semibold text-[var(--text-primary)]">Müddət</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr><td className="px-4 py-2 font-mono text-xs">next-auth.session-token</td><td className="px-4 py-2">Sessiya idarəsi</td><td className="px-4 py-2">30 gün</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">next-auth.csrf-token</td><td className="px-4 py-2">CSRF qoruması</td><td className="px-4 py-2">Sessiya</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">theme</td><td className="px-4 py-2">Tema seçimi (açıq/tünd)</td><td className="px-4 py-2">1 il</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section num="7" title="İstifadəçi Hüquqları">
            <p>GDPR və Azərbaycan qanunvericiliyinə uyğun olaraq aşağıdakı hüquqlara maliksiniz:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-[var(--text-primary)]">Giriş hüququ</strong> — şəxsi məlumatlarınıza baxmaq</li>
              <li><strong className="text-[var(--text-primary)]">Düzəliş hüququ</strong> — yanlış məlumatları düzəltmək</li>
              <li><strong className="text-[var(--text-primary)]">Silinmə hüququ</strong> — hesabı və bütün məlumatları silmək</li>
              <li><strong className="text-[var(--text-primary)]">Portability</strong> — məlumatlarınızı JSON formatında ixrac etmək</li>
            </ul>
            <p className="mt-3">
              Bu hüquqlardan istifadə etmək üçün: <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a>
            </p>
          </Section>

          <Section num="8" title="Uşaqların Məxfiliyi">
            <p>
              Platformamız 16 yaşdan aşağı şəxslər üçün nəzərdə tutulmayıb.
              16 yaşdan kiçik şəxslərin qeydiyyatına icazə verilmir.
              Belə istifadəçi aşkar edildikdə hesab dərhal silinir.
            </p>
          </Section>

          <Section num="9" title="Siyasətin Dəyişdirilməsi">
            <p>
              Bu Gizlilik Siyasəti vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişikliklər olduqda
              qeydiyyatda olan email ünvanınıza bildiriş göndəriləcək.
              Cari siyasətin tarixi yuxarıda göstərilib.
            </p>
          </Section>

          <Section num="10" title="Əlaqə">
            <p>Gizlilik məsələləri ilə bağlı suallarınız üçün:</p>
            <div className="mt-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2 text-sm">
              <p><strong className="text-[var(--text-primary)]">Şirkət:</strong> {COMPANY}</p>
              <p><strong className="text-[var(--text-primary)]">Email:</strong> <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a></p>
              <p><strong className="text-[var(--text-primary)]">Telefon:</strong> <a href={`tel:${PHONE.replace(/\s/g,'')}`} className="text-brand-blue hover:underline">{PHONE}</a></p>
              <p><strong className="text-[var(--text-primary)]">WhatsApp:</strong> <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Yazın 💬</a></p>
              <p><strong className="text-[var(--text-primary)]">Platforma:</strong> <Link href="/" className="text-brand-blue hover:underline">bacar.az</Link></p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {COMPANY}. Bütün hüquqlar qorunur. ·{" "}
          <Link href="/" className="hover:text-brand-blue transition-colors">Baş səhifə</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-brand-blue/10 text-brand-blue text-sm font-black flex items-center justify-center flex-shrink-0">
          {num}
        </span>
        {title}
      </h2>
      <div className="pl-9 space-y-2">{children}</div>
    </section>
  );
}
