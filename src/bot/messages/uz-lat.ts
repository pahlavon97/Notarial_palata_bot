export const MESSAGES_UZ_LAT = {
  WELCOME: (name: string) =>
    `Assalomu alaykum, *${name}*!\n\n` +
    `O‘zbekiston Respublikasi Notarial palatasining rasmiy axborot-maslahat Telegram botiga xush kelibsiz.\n\n` +
    `Mazkur bot notarial xizmatlar, qonuniy talablar, davlat bojlari va eng yaqin notariuslarni topish bo‘yicha tezkor hamda rasmiy manbalarga (Lex.uz va Advice.uz) asoslangan ma’lumot beradi.\n\n` +
    `Quyidagi menyudan kerakli bo‘limni tanlang yoki savolingizni yozing:`,

  HELP:
    `ℹ️ *Botdan foydalanish bo‘yicha qo‘llanma:*\n\n` +
    `• *Huquqiy savol berish:* O‘zingizni qiziqtirgan notarial harakat (masalan, "avtomobil oldi-sotdisi uchun qanday hujjatlar kerak?", "meros ochish muddati qancha?") bo‘yicha savolingizni to‘g‘ridan-to‘g‘ri yozing.\n` +
    `• *Mavzuli bo‘limlar:* Meros, uy-joy, avtotransport, ishonchnoma va hadya bo‘yicha rasmiy talablar va davlat bojlarini ko‘ring.\n` +
    `• *Notariusni topish:* Hududingizdagi rasmiy notariuslarning manzili, telefoni va ish vaqtini bilib oling.\n` +
    `• *Tilni tanlash:* /lang buyrug‘i orqali o‘zbek lotin, kirill yoki rus tilini tanlashingiz mumkin.\n\n` +
    `⚠️ *Eslatma:* Bot huquqiy-axborot berish uchun mo‘ljallangan bo‘lib, fuqarolar murojaatlarini operatorlarga taqsimlash yoki notarius o‘rniga harakatni tasdiqlash vakolatiga ega emas.`,

  ABOUT:
    `🏛 *O‘zbekiston Respublikasi Notarial palatasi haqida*\n\n` +
    `O‘zbekiston Respublikasi Notarial palatasi — barcha notariuslarni a’zolik asosida birlashtiruvchi nodavlat notijorat tashkilotidir.\n\n` +
    `Palataning asosiy vazifalari:\n` +
    `• Fuqarolar va yuridik shaxslarning huquqlari hamda qonuniy manfaatlarini himoya qilish;\n` +
    `• Notariat sohasida qonun ustuvorligini ta’minlash;\n` +
    `• Yagona notarial amaliyotni shakllantirish;\n` +
    `• Notariuslarning kasbiy faoliyatini muvofiqlashtirish.\n\n` +
    `🌐 *Rasmiy veb-sayt:* [notarialpalata.uz](https://notarialpalata.uz/)\n` +
    `📞 *Ishonch telefoni:* (71) 203-05-55`,

  ASK_QUESTION_PROMPT:
    `✍️ *Huquqiy savolingizni yozing:*\n\n` +
    `Masalan:\n` +
    `• _Meros guvohnomasi olish uchun qayerga murojaat qilish kerak?_\n` +
    `• _Avtomobil oldi-sotdisida davlat boji qancha?_\n` +
    `• _Ishonchnomaning eng uzoq amal qilish muddati qancha?_\n\n` +
    `Savolingizni yuboring, tizim rasmiy qonunchilik (Lex.uz) asosida javob tayyorlaydi.`,

  RATE_LIMIT_WARNING: (seconds: number) =>
    `⏳ Juda ko‘p so‘rov yuborildi. Iltimos, *${seconds} soniya* kutib, qayta urinib ko‘ring.`,

  BURST_WARNING:
    `⚠️ Iltimos, xabarlarni juda tez yubormang. Tizim xavfsizligi uchun ozgina kuting.`,

  SELECT_LANGUAGE: `🌐 Iltimos, muloqot tilini tanlang:\nПожалуйста, выберите язык:\nИлтимос, тилни танланг:`,

  LANGUAGE_CHANGED: `✅ Muloqot tili *O‘zbekcha (Lotin)* ga o‘zgartirildi.`,

  SELECT_REGION: `📍 Kerakli hududni (viloyat yoki shahar) tanlang:`,

  NO_NOTARIES_FOUND: `Ushbu hudud bo‘yicha hozircha ro‘yxat mavjud emas. Rasmiy portal orqali qidiring:`,

  MAIN_MENU_TITLE: `Asosiy menyu:`,
};
