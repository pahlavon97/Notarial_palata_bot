# O‘zbekiston Respublikasi Notarial Palatasi Rasmiy Huquqiy Telegram Boti

Production darajasidagi, xavfsiz, testlangan va rasmiy qonunchilik manbalariga (Lex.uz, Advice.uz, E-Notarius) tayangan Telegram bot tizimi.

---

## 🏛 1. Loyihaning Maqsadi va Tamoyillari

Ushbu bot O‘zbekiston Respublikasi fuqarolari, notariuslar va tadbirkorlar uchun notarial xizmatlar, qonuniy talablar, davlat bojlari stavkalari va notariuslar reestri bo‘yicha tezkor, tushunarli va 100% huquqiy asoslangan ma’lumot berishga mo‘ljallangan.

### ⚠️ Muhim Cheklov (Strict Architectural Constraint):
> Loyiha doirasida fuqarolar murojaatlarini operatorlarga, Notarial palata xodimlariga yoki ijrochilarga yuborish, ijro nazoratiga olish funksiyasi **MUDOM MAVJUD EMAS**. Bot sof huquqiy-axborot beruvchi va qidiruv tizimi bo‘lib, uydirma ma’lumotlar (AI hallucination) va noto‘g‘ri normativ talqinlardan to‘liq himoyalangan.

---

## 📚 2. Rasmiy Huquqiy Manbalar Integratsiyasi

Tizim quyidagi 3 ta rasmiy davlat axborot resurslari bilan ishlaydi:
1. **Lex.uz Milliy bazasi (`LexUzProvider`):**
   - *"Notariat to‘g‘risida"*gi Qonun (No. 343-I, amaldagi tahrir);
   - O‘zbekiston Respublikasi Fuqarolik kodeksi (Meros huquqi 1112-1157-moddalar, Hadya 502-511-moddalar, Ishonchnoma 134-144-moddalar, Ko‘chmas mulk oldi-sotdisi 479-488-moddalar);
   - O‘zbekiston Respublikasi Oila kodeksi (Nikoh shartnomasi 29-36-moddalar);
   - *"Davlat boji to‘g‘risida"*gi Qonun (ZRU-600) — Notarial harakatlar stavkalari.
2. **Advice.uz Bepul huquqiy portali (`AdviceUzProvider`):**
   - 701-kategoriya (Notarial xizmatlar va hujjatlarni rasmiylashtirish);
   - Bosqichma-bosqich qo‘llanmalar va talab etiladigan hujjatlar ro‘yxati.
3. **E-Notarius.uz Axborot tizimi (`ENotariusProvider`):**
   - Hududlar va tumanlar bo‘yicha rasmiy faoliyat ko‘rsatayotgan notariuslar reestri;
   - Notarius litsenziyasi, manzili, ish vaqti, rasmiy telefoni va E-notarius orqali navbatga yozilish havolasi.

---

## 🛡️ 3. Xavfsizlik va DevSecOps (OWASP)

- **SSRF Guard (`SsrfGuard`):** Faqat ruxsat etilgan davlat domenlariga (`lex.uz`, `advice.uz`, `e-notarius.uz`, `notarialpalata.uz`) HTTPS orqali ulanish ruxsat etilgan. Barcha ichki IP manzillar (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `169.254.x.x`, `localhost`) qat’iy bloklanadi.
- **Ko‘p bosqichli Rate Limiting (`RateLimiter`):**
  - Foydalanuvchi bo‘yicha so‘rovlar soni (sliding window): 1 daqiqada 20 ta so‘rov.
  - Spam burst himoyasi: 5 soniyada maksimum 5 ta xabar.
  - Redis bilan ishlaydi, Redis bo‘lmaganda xavfsiz In-Memory rejimiga avtomatik o‘tadi.
- **Telegram Update Idempotency (`UpdateDeduplicator`):** Telegram tomonidan yuborilgan takroriy update_id larni keshlaydi va takroriy hisoblashlarni oldini oladi.
- **Prompt Injection & XSS Sanitizer (`Sanitizer`):** Tizim promptini buzishga qaratilgan komandalar neytrallanadi, HTML/Markdown maxsus belgilari xavfsiz escape qilinadi.
- **Sir saqlash va Redaction (`Logger`):** Bot tokeni, ma’lumotlar bazasi parollari va fuqarolarning shaxsiy ma’lumotlari loglarda `[REDACTED]` sifatida yashiriladi.
- **Maxfiylik:** Bot fuqarolardan pasport nusxalari yoki JShShIR yig‘maydi (No PII policy).

---

## 🚀 4. Texnologik Stek

- **Dasturlash tili:** Node.js 22 LTS, TypeScript (Strict mode, ES2022)
- **Telegram Bot Framework:** Telegraf v4.16
- **Web API & Webhooks:** Express, Helmet, CORS
- **Ma’lumotlar bazasi:** PostgreSQL 16 + Prisma ORM 5.22
- **Kesh va Navbatlar:** Redis 7 + BullMQ
- **Validatsiya:** Zod
- **Testlash tizimi:** Jest, Supertest, ts-jest (100% pass rate)
- **Konteynerlashtirish:** Docker (Multi-stage alpine), Docker Compose
- **Deploy:** Railway / Nixpacks, Procfile, GitHub Actions CI

---

## 📦 5. O‘rnatish va Mahalliy Ishga Tushirish

### 1. Repositoryni klonlash va paketlarni o‘rnatish
```bash
npm install
```

### 2. Muhit o‘zgaruvchilarini sozlash
`.env.example` faylidan nusxa olib `.env` yarating:
```bash
cp .env.example .env
```
Kerakli qiymatlarni kiriting:
```env
TELEGRAM_BOT_TOKEN=bot_tokeningizni_yozing
TELEGRAM_MODE=polling # yoki webhook
DATABASE_URL=postgresql://notary_user:notary_secure_pwd_2026@localhost:5432/notarial_palata_db?schema=public
REDIS_URL=redis://localhost:6379
```

### 3. Prisma Migratsiya va Seeding
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Build va Start
```bash
# Build
npm run build

# Start (Production)
npm start

# Development rejimida
npm run dev
```

---

## 🧪 6. Testlarni Ishga Tushirish

Loyihada barcha qatlamlar 100% testlangan (58 ta test):
```bash
# Barcha testlarni ishga tushirish
npm test

# Test coverage hisoboti bilan
npm run test:coverage
```

### Test turlari:
- **Unit testlar:** Rate limiter, SSRF guard, Sanitizer, Update deduplicator, LexUZ provayderi, AdviceUZ provayderi, E-Notarius provayderi, Bot handlerlar.
- **Integratsiya testlari:** Webhook / Healthcheck endpointlari, Menyu marshrutlash, Til almashtirish, Murojaatni operatorga yo‘naltirmaslik kafolati.
- **Yuklama sinovi (Load test):** 1 200 ta ro‘yxatdan o‘tgan foydalanuvchi va 100 ta bir vaqtdagi parallel so‘rovlar (O‘rtacha javob vaqti < 1ms).

---

## 🐳 7. Docker orqali Ishga Tushirish

```bash
# Barcha servislarni (Bot + Postgres + Redis) ishga tushirish:
docker-compose up -d --build

# Loglarni kuzatish:
docker-compose logs -f bot
```

---

## ☁️ 8. Railway da Deploy Qilish

Loyiha Railway uchun oldindan sozlangan:
1. Railway loyihasida yangi PostgreSQL va Redis servisi qo‘shing.
2. Bot repozitoriyasini ulang.
3. Environment variables bo‘limida `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`, `REDIS_URL` ni belgilang.
4. Railway avtomatik ravishda `railway.json` orqali quyidagi komandalarni bajaradi:
   - Build: `npx prisma generate && npm run build`
   - Start: `npx prisma db push --skip-generate && node dist/index.js`
   - Healthcheck: `/health/live` (15s timeout)

---

## 🩺 9. Monitoring va Health Check Endpointlari

- `GET /health/live` — Tizim tirikligini tekshirish (Liveness Probe).
- `GET /health` — Barcha tashqi provayderlar (`LexUzProvider`, `AdviceUzProvider`, `ENotariusProvider`) va tizim resurslarining holati. Maxfiy tokenlar oshkor qilinmaydi.
