export const ALLOWED_EXTERNAL_HOSTS = [
  'lex.uz',
  'advice.uz',
  'e-notarius.uz',
  'notarialpalata.uz',
] as const;

export const OFFICIAL_URLS = {
  LEX_UZ_HOME: 'https://lex.uz/',
  LEX_UZ_NOTARIAT_LAW: 'https://lex.uz/docs/34304', // Qonun: Notariat to'g'risida
  LEX_UZ_CIVIL_CODE: 'https://lex.uz/docs/111189', // Fuqarolik kodeksi (meros, hadya, shartnomalar)
  LEX_UZ_STATE_DUTY: 'https://lex.uz/docs/4683889', // Qonun: Davlat boji to'g'risida (ZRU-600)
  ADVICE_UZ_NOTARIAT_CATEGORY: 'https://advice.uz/uz/category/701',
  E_NOTARIUS_HOME: 'https://e-notarius.uz/',
  E_NOTARIUS_FIND_NOTARY: 'https://e-notarius.uz/',
  NOTARIAL_PALATA_OFFICIAL: 'https://notarialpalata.uz/',
} as const;

export const LEGAL_TOPICS = {
  MEROS: 'meros',
  AVTOMOBIL: 'avtomobil',
  UY_JOY: 'uy_joy',
  ISHONCHNOMA: 'ishonchnoma',
  HADYA: 'hadya',
  NIKOH_SHARTNOMASI: 'nikoh_shartnomasi',
  NOTARIAL_TASDIQLASH: 'notarial_tasdiqlash',
  DAVLAT_BOJI: 'davlat_boji',
  HUJJATLARNI_RASMIYLASHTIRISH: 'hujjatlarni_rasmiylashtirish',
  BOSHQA: 'boshqa',
  NOTARIUS_TOPISH: 'notarius_topish',
  XIZMATLAR_HAQIDA: 'xizmatlar_haqida',
} as const;

export type LegalTopicKey = keyof typeof LEGAL_TOPICS;

export const REGIONS_OF_UZBEKISTAN = [
  { id: 'tashkent_city', nameUzLat: 'Toshkent shahri', nameUzCyr: 'Тошкент шаҳри', nameRu: 'г. Ташкент' },
  { id: 'tashkent_region', nameUzLat: 'Toshkent viloyati', nameUzCyr: 'Тошкент вилояти', nameRu: 'Ташкентская область' },
  { id: 'samarkand', nameUzLat: 'Samarqand viloyati', nameUzCyr: 'Самарқанд вилояти', nameRu: 'Самаркандская область' },
  { id: 'fergana', nameUzLat: 'Farg‘ona viloyati', nameUzCyr: 'Фарғона вилояти', nameRu: 'Ферганская область' },
  { id: 'andijan', nameUzLat: 'Andijon viloyati', nameUzCyr: 'Андижон вилояти', nameRu: 'Андижанская область' },
  { id: 'namangan', nameUzLat: 'Namangan viloyati', nameUzCyr: 'Наманган вилояти', nameRu: 'Наманганская область' },
  { id: 'bukhara', nameUzLat: 'Buxoro viloyati', nameUzCyr: 'Бухоро вилояти', nameRu: 'Бухарская область' },
  { id: 'khorezm', nameUzLat: 'Xorazm viloyati', nameUzCyr: 'Хоразм вилояти', nameRu: 'Хорезмская область' },
  { id: 'kashkadarya', nameUzLat: 'Qashqadaryo viloyati', nameUzCyr: 'Қашқадарё вилояти', nameRu: 'Кашкадарьинская область' },
  { id: 'surkhandarya', nameUzLat: 'Surxondaryo viloyati', nameUzCyr: 'Сурхондарё вилояти', nameRu: 'Сурхандарьинская область' },
  { id: 'jizzakh', nameUzLat: 'Jizzax viloyati', nameUzCyr: 'Жиззах вилояти', nameRu: 'Джизакская область' },
  { id: 'sirdarya', nameUzLat: 'Sirdaryo viloyati', nameUzCyr: 'Сирдарё вилояти', nameRu: 'Сырдарьинская область' },
  { id: 'navoiy', nameUzLat: 'Navoiy viloyati', nameUzCyr: 'Навоий вилояти', nameRu: 'Навоийская область' },
  { id: 'karakalpakstan', nameUzLat: 'Qoraqalpog‘iston Respublikasi', nameUzCyr: 'Қорақалпоғистон Республикаси', nameRu: 'Республика Каракалпакстан' },
] as const;

export const LEGAL_DISCLAIMER = {
  UZ_LATIN: `\n\n⚖️ *Huquqiy eslatma:* Mazkur ma'lumot O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz va Advice.uz) asosida ma'lumot tariqasida taqdim etilmoqda. Ushbu tushuntirish individual yuridik xulosa hisoblanmaydi va notarius tomonidan notarial harakatni tasdiqlash o'rnini bosmaydi.`,
  UZ_CYRILLIC: `\n\n⚖️ *Ҳуқуқий эслатма:* Мазкур маълумот Ўзбекистон Республикасининг амалдаги қонунчилиги (Lex.uz ва Advice.uz) асосида маълумот тариқасида тақдим этилмоқда. Ушбу тушунтириш индивидуал юридик хулоса ҳисобланмайди ва нотариус томонидан нотариал ҳаракатни тасдиқлаш ўрнини босмайди.`,
  RU: `\n\n⚖️ *Правовая оговорка:* Данная информация носит справочно-консультационный характер и основана на действующем законодательстве Республики Узбекистан (Lex.uz и Advice.uz). Разъяснение не является индивидуальным юридическим заключением и не заменяет совершение нотариального действия нотариусом.`,
} as const;
