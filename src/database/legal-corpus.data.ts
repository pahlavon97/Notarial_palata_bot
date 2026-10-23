export type DocumentLegalStatus = 'IN_FORCE' | 'REPEALED' | 'HISTORICAL_EDITION' | 'UNKNOWN';

export interface VerifiedLegalItem {
  id: string;
  category:
    | 'MEROS'
    | 'AVTOMOBIL'
    | 'UY_JOY'
    | 'ISHONCHNOMA'
    | 'HADYA'
    | 'NIKOH_SHARTNOMASI'
    | 'NOTARIAL_TASDIQLASH'
    | 'DAVLAT_BOJI'
    | 'HUJJATLARNI_RASMIYLASHTIRISH'
    | 'BOSHQA';
  source: 'LEX_UZ' | 'ADVICE_UZ';
  docNumber: string;
  docTitle: {
    uzLat: string;
    uzCyr: string;
    ru: string;
  };
  articleNumber: string;
  articleTitle: {
    uzLat: string;
    uzCyr: string;
    ru: string;
  };
  keywords: string[];
  officialUrl: string;
  cleanOfficialUrl?: string;
  verifiedDate: string;
  isCurrentEdition: boolean;
  legalStatus: DocumentLegalStatus;
  adoptionDate?: string;
  effectiveDate?: string;
  repealDate?: string;
  content: {
    uzLat: string;
    uzCyr: string;
    ru: string;
  };
  requiredDocuments?: {
    uzLat: string[];
    uzCyr: string[];
    ru: string[];
  };
  stateDuty?: {
    uzLat: string;
    uzCyr: string;
    ru: string;
  };
}

export const VERIFIED_LEGAL_CORPUS: VerifiedLegalItem[] = [
  // 1. MEROS (Inheritance) - Civil Code Art. 1112, 1146, 1147
  {
    id: 'legal-meros-01',
    category: 'MEROS',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      uzCyr: 'Ўзбекистон Республикаси Фуқаролик кодекси',
      ru: 'Гражданский кодекс Республики Узбекистан',
    },
    articleNumber: '1146, 1147-moddalar',
    articleTitle: {
      uzLat: 'Merosni qabul qilib olish va meros guvohnomasini berish tartibi',
      uzCyr: 'Меросни қабул қилиб олиш ва мерос гувоҳномасини бериш тартиби',
      ru: 'Принятие наследства и выдача свидетельства о праве на наследство',
    },
    keywords: ['meros', 'vasiyatnoma', 'meros guvohnomasi', 'merosxo‘r', '6 oy', 'qabul qilish', 'мерос', 'наследство', 'завещание', 'свидетельство'],
    officialUrl: 'https://lex.uz/docs/111189#1146',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Meros ochilgan kundan e'tiboran 6 (olti) oy muddat ichida merosxo'r tomonidan qabul qilib olinishi mumkin. Meros guvohnomasi meros ochilgan joydagi notarius tomonidan meros ochilgan kundan e'tiboran 6 oy o'tgach beriladi (vasiyatnoma yoki qonun bo'yicha boshqa merosxo'rlar yo'qligi aniq bo'lsa, 6 oy o'tmasdan ham berilishi mumkin).",
      uzCyr: 'Мерос очилган кундан эътиборан 6 (олти) ой муддат ичида меросхўр томонидан қабул қилиб олиниши мумкин. Мерос гувоҳномаси мерос очилган жойдаги нотариус томонидан мерос очилган кундан эътиборан 6 ой ўтгач берилади.',
      ru: 'Наследство может быть принято в течение 6 (шести) месяцев со дня открытия наследства. Свидетельство о праве на наследство выдается нотариусом по месту открытия наследства по истечении 6 месяцев со дня открытия.',
    },
    requiredDocuments: {
      uzLat: [
        'Meros qoldiruvchining o‘lim haqidagi guvohnomasi',
        'Merosxo‘rning shaxsini tasdiqlovchi hujjati',
        'Qarindoshlik munosabatlarini tasdiqlovchi hujjatlar (tug‘ilganlik, nikoh guvohnomalari)',
        'Vasiyatnoma (agar mavjud bo‘lsa)',
        'Meros mol-mulkiga bo‘lgan egalik huquqini tasdiqlovchi hujjatlar (kadastr, texposport)',
      ],
      uzCyr: [
        'Мерос қолдирувчининг ўлим ҳақидаги гувоҳномаси',
        'Меросхўрнинг шахсини тасдиқловчи ҳужжати',
        'Қариндошлик муносабатларини тасдиқловчи ҳужжатлар',
        'Васиятнома (агар мавжуд бўлса)',
        'Мерос мол-мулкига бўлган эгалик ҳуқуқини тасдиқловчи ҳужжатлар',
      ],
      ru: [
        'Свидетельство о смерти наследодателя',
        'Документ, удостоверяющий личность наследника',
        'Документы, подтверждающие родственные отношения',
        'Завещание (при наличии)',
        'Правоустанавливающие документы на наследственное имущество',
      ],
    },
    stateDuty: {
      uzLat: "BHMning 0.5 baravari (meros guvohnomasi berilganligi uchun). 1-navbatdagi qarindoshlar (ota-ona, turmush o'rtoq, bolalar) uchun qonunchilikda imtiyozlar nazarda tutilgan.",
      uzCyr: 'БҲМнинг 0.5 баравари (мерос гувоҳномаси берилганлиги учун). 1-навбатдаги қариндошлар учун имтиёзлар мавжуд.',
      ru: '0.5 БРВ за выдачу свидетельства о праве на наследство. Для наследников 1-й очереди предусмотрены льготы.',
    },
  },

  // 2. AVTOMOBIL OLDI-SOTDISI (Auto sale)
  {
    id: 'legal-avto-01',
    category: 'AVTOMOBIL',
    source: 'LEX_UZ',
    docNumber: '4683889',
    docTitle: {
      uzLat: "O'zbekiston Respublikasining 'Davlat boji to'g'risida'gi Qonuni",
      uzCyr: "Ўзбекистон Республикасининг 'Давлат божи тўғрисида'ги Қонуни",
      ru: "Закон Республики Узбекистан 'О государственной пошлине'",
    },
    articleNumber: 'Notarial harakatlar stavkalari',
    articleTitle: {
      uzLat: 'Avtotransport vositalarini boshqa shaxsga o‘tkazish shartnomalarini tasdiqlash',
      uzCyr: 'Автотранспорт воситаларини бошқа шахсга ўтказиш шартномаларини тасдиқлаш',
      ru: 'Удостоверение договоров отчуждения автотранспортных средств',
    },
    keywords: ['avtomobil', 'mashina', 'oldi-sotdi', 'avtotransport', 'davlat boji', 'texpasport', 'автомобиль', 'машина', 'купли-продажи', 'транспорт'],
    officialUrl: 'https://lex.uz/docs/4683889',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Avtotransport vositasining oldi-sotdi, hadya va ayirboshlash shartnomalari notarial tartibda tasdiqlanishi shart. Notarius tomonidan avtomobilning garovda emasligi, taqiq yoki xatlov yo'qligi 'Notarius' avtomatlashtirilgan axborot tizimi orqali real vaqt rejimida tekshiriladi.",
      uzCyr: 'Автотранспорт воситасининг олди-сотди шартномалари нотариал тартибда тасдиқланиши шарт. Нотариус автомобилнинг тақиқда эмаслигини электрон тизим орқали текширади.',
      ru: 'Договоры купли-продажи, дарения и мены автотранспортных средств подлежат обязательному нотариальному удостоверению. Нотариус проверяет отсутствие ареста и запрета в режиме реального времени.',
    },
    requiredDocuments: {
      uzLat: [
        'Sotuvchi va sotib oluvchining pasporti / ID-kartasi',
        'Avtotransport vositasining ro‘yxatdan o‘tkazilganligi to‘g‘risidagi guvohnoma (texpasport)',
        'Turmush o‘rtog‘ining notarial tasdiqlangan roziligi (agar avtomobil birgalikdagi nikoh davrida olingan bo‘lsa)',
        'Avtomobil gaz ballon bilan jihozlangan bo‘lsa — sinov dalolatnomasi',
      ],
      uzCyr: [
        'Сотувчи ва сотиб олувчининг паспорти / ID-картаси',
        'Техник паспорт',
        'Турмуш ўртоғининг нотариал тасдиқланган розилиги',
        'Газ баллон синов далолатномаси (ўрнатилган бўлса)',
      ],
      ru: [
        'Паспорт / ID-карта продавца и покупателя',
        'Свидетельство о регистрации ТС (техпаспорт)',
        'Нотариально удостоверенное согласие супруга(и)',
        'Акт испытания газового баллона (при наличии)',
      ],
    },
    stateDuty: {
      uzLat: "Avtomobil ishlab chiqarilgan yiliga va dvigatel quvvatiga qarab tabaqalashtirilgan (BHMning 3 baravaridan boshlanadi). Yaqin qarindoshlar (ota-ona, er-xotin, bolalar) o'rtasida BHMning 0.5 baravari miqdorida.",
      uzCyr: 'Автомобиль ишлаб чиқарилган йилига қараб БҲМнинг 3 бараваридан. Яқин қариндошлар ўртасида БҲМнинг 0.5 баравари.',
      ru: 'В зависимости от года выпуска и мощности (от 3 БРВ). Между близкими родственниками — 0.5 БРВ.',
    },
  },

  // 3. KO'CHMAS MULK OLDI-SOTDISI (Real Estate)
  {
    id: 'legal-mulk-01',
    category: 'UY_JOY',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      uzCyr: 'Ўзбекистон Республикаси Фуқаролик кодекси',
      ru: 'Гражданский кодекс Республики Узбекистан',
    },
    articleNumber: '479-488-moddalar',
    articleTitle: {
      uzLat: 'Ko‘chmas mulkni sotish shartnomasi va uning shakli',
      uzCyr: 'Кўчмас мулкни сотиш шартномаси ва унинг шакли',
      ru: 'Договор продажи недвижимости и его форма',
    },
    keywords: ['uy', 'kvartira', 'ko‘chmas mulk', 'oldi-sotdi', 'kadastr', 'notarius', 'taqiq', 'уй', 'квартира', 'кўчмас мулк', 'недвижимость'],
    officialUrl: 'https://lex.uz/docs/111189#479',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Uy-joy, bino, inshoot yoki boshqa ko'chmas mulkni sotish shartnomasi yozma shaklda tuziladi va notarial tartibda tasdiqlanishi shart. Shartnoma tuzishdan oldin notarius barcha kommunal xizmatlar, soliq qarzdorligi va ko'chmas mulk bo'yicha taqiq yoki xatlov yo'qligini idoralararo elektron tizim orqali tekshiradi.",
      uzCyr: 'Уй-жой ёки кўчмас мулкни сотиш шартномаси нотариал тартибда тасдиқланиши шарт. Нотариус солиқ, коммунал қарзлар ва тақиқни электрон тизим орқали текширади.',
      ru: 'Договор продажи недвижимости подлежит обязательному нотариальному удостоверению. Нотариус проверяет отсутствие налоговых, коммунальных задолженностей и ареста через межведомственную систему.',
    },
    requiredDocuments: {
      uzLat: [
        'Taraflarning shaxsini tasdiqlovchi hujjatlari (pasport/ID-karta)',
        'Mulk huquqini tasdiqlovchi hujjat (shartnoma, guvohnoma, qaror) va Kadastr pasporti',
        'Uyda doimiy ro‘yxatda turgan shaxslar haqida ma’lumotnoma',
        'Barcha voyaga yetgan ro‘yxatda turgan oila a’zolarining notarial roziligi',
        'Turmush o‘rtog‘ining notarial roziligi (birgalikdagi mulk bo‘lsa)',
      ],
      uzCyr: [
        'Тарафларнинг паспорт/ID-картаси',
        'Мулк ҳуқуқини тасдиқловчи ҳужжат ва Кадастр паспорти',
        'Рўйхатда турувчилар тўғрисида маълумотнома',
        'Оила аъзолари ва турмуш ўртоғининг розилиги',
      ],
      ru: [
        'Паспорта / ID-карты сторон',
        'Правоустанавливающий документ и кадастровый паспорт',
        'Справка о зарегистрированных лицах',
        'Согласие всех совершеннолетних прописанных лиц и супруга(и)',
      ],
    },
    stateDuty: {
      uzLat: "Toshkent shahri, Nukus shahri va viloyat markazlarida: ko'chmas mulk maydoniga qarab BHMning 1 baravaridan 3 baravarigacha. Yaqin qarindoshlarga (ota-ona, farzand, er-xotin) BHMning 0.5 baravari.",
      uzCyr: 'Тошкент ва вилоят марказларида майдонига қараб БҲМнинг 1 дан 3 бараваригача. Яқин қариндошларга 0.5 баравар.',
      ru: 'В Ташкенте и областных центрах в зависимости от площади — от 1 до 3 БРВ. Близким родственникам — 0.5 БРВ.',
    },
  },

  // 4. ISHONCHNOMA (Power of Attorney)
  {
    id: 'legal-ishonch-01',
    category: 'ISHONCHNOMA',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      uzCyr: 'Ўзбекистон Республикаси Fuqarolik kodeksi',
      ru: 'Гражданский кодекс Республики Узбекистан',
    },
    articleNumber: '134-144-moddalar',
    articleTitle: {
      uzLat: 'Ishonchnoma va uning amal qilish muddatlari',
      uzCyr: 'Ишончнома ва унинг амал қилиш муддатлари',
      ru: 'Доверенность и сроки её действия',
    },
    keywords: ['ishonchnoma', 'doverennost', 'muddat', 'boshqarish', 'tasarruf etish', 'ишончнома', 'доверенность', 'срок'],
    officialUrl: 'https://lex.uz/docs/111189#139',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Ishonchnoma ko'pi bilan 3 (uch) yil muddatga berilishi mumkin. Agar ishonchnomada muddat ko'rsatilmagan bo'lsa, u berilgan kundan boshlab 1 (bir) yil davomida o'z kuchini saqlaydi. Berilgan sanasi ko'rsatilmagan ishonchnoma haqiqiy hisoblanmaydi (haqiqiy emas). Avtotransport vositasini tasarruf etish (sotish huquqi bilan) va boshqarish ishonchnomalari E-Notarius orqali videoaloqa orqali ham rasmiylashtirilishi mumkin.",
      uzCyr: 'Ишончнома кўпи билан 3 йил муддатга берилади. Муддат кўрсатилмаса 1 йил амал қилади. Берилган санаси кўрсатилмаган ишончнома ҳақиқий эмас.',
      ru: 'Доверенность может быть выдана на срок не более 3 лет. Если срок не указан, она сохраняет силу в течение 1 года со дня совершения. Доверенность, в которой не указана дата её совершения, ничтожна.',
    },
    requiredDocuments: {
      uzLat: [
        'Ishonch bildiruvchining pasporti / ID-kartasi',
        'Ishonchli shaxsning pasport ma’lumotlari (nusxasi yoki JShShIR)',
        'Mulk bo‘yicha ishonchnoma bo‘lsa — tegishli mulk hujjati (texpasport, kadastr)',
      ],
      uzCyr: [
        'Ишонч билдирувчининг паспорти/ID-картаси',
        'Ишончли шахснинг паспорт маълумотлари (нусха ёки ЖШШИР)',
        'Тегишли мулк ҳужжати (техпаспорт, кадастр)',
      ],
      ru: [
        'Паспорт / ID-карта доверителя',
        'Паспортные данные или ПИНФЛ поверенного',
        'Документы на имущество (при передаче прав на авто или недвижимость)',
      ],
    },
    stateDuty: {
      uzLat: "Avtotransportni boshqarish: ota-ona, er-xotin, bolalar, aka-uka, opa-singillarga — BHMning 0.5 baravari; boshqa shaxslarga — BHMning 3 baravari. Mulkni tasarruf etish huquqi bilan: yaqin qarindoshlarga — BHMning 1 baravari; boshqa shaxslarga — BHMning 3 baravari.",
      uzCyr: 'Авто бошқариш: яқин қариндошларга БҲМ 0.5; бошқаларга БҲМ 3. Тасарруф этиш: яқинларга БҲМ 1, бошқаларга БҲМ 3.',
      ru: 'Управление авто: близким родственникам — 0.5 БРВ, посторонним — 3 БРВ. С правом распоряжения: близким — 1 БРВ, посторонним — 3 БРВ.',
    },
  },

  // 5. HADYA SHARTNOMASI (Gift / Donation)
  {
    id: 'legal-hadya-01',
    category: 'HADYA',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      uzCyr: 'Ўзбекистон Respublikasi Fuqarolik kodeksi',
      ru: 'Гражданский кодекс Республики Узбекистан',
    },
    articleNumber: '502-511-moddalar',
    articleTitle: {
      uzLat: 'Hadya shartnomasi va uni bekor qilish asoslari',
      uzCyr: 'Ҳадя шартномаси ва уни бекор қилиш асослари',
      ru: 'Договор дарения и основания его отмены',
    },
    keywords: ['hadya', 'hadya shartnomasi', 'sovg‘a', 'beg‘araz', 'uy hadya qilish', 'ҳадя', 'подарок', 'дарение'],
    officialUrl: 'https://lex.uz/docs/111189#502',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Hadya shartnomasiga binoan bir taraf (hadya qiluvchi) boshqa taraf (hadya oluvchi)ga mol-mulkni tekinga mulk qilib beradi yoki berish majburiyatini oladi. Hadya evaziga hadya oluvchidan hech qanday haq yoki xizmat talab qilinishi mumkin emas (agar talab qilinsa, bitim haqiqiy emas deb topiladi). Ko'chmas mulk va avtomobil hadyasi notarial tasdiqlanadi.",
      uzCyr: 'Ҳадя шартномаси бўйича мол-мулк текинга берилади. Ҳадя эвазига ҳеч қандай ҳақ ёки мажбурият талаб қилиниши мумкин эмас. Кўчмас мулк ва авто ҳадяси нотариал тасдиқланади.',
      ru: 'По договору дарения одна сторона безвозмездно передает другой стороне имущество в собственность. Встречное предоставление вещи или обязательства делает договор недействительным.',
    },
    requiredDocuments: {
      uzLat: [
        'Hadya qiluvchi va oluvchining shaxsini tasdiqlovchi hujjatlari',
        'Mulk huquqini tasdiqlovchi hujjatlar (kadastr, texposport)',
        'Birgalikdagi mulkdorlarning (turmush o‘rtoq, ro‘yxatdagilar) notarial roziligi',
        'Qarindoshlikni tasdiqlovchi hujjatlar (soliq imtiyozi uchun)',
      ],
      uzCyr: [
        'Ҳадя қилувчи ва олувчининг шахсини тасдиқловчи ҳужжатлари',
        'Мулк ҳуқуқи ҳужжатлари',
        'Биргаликдаги мулкдорлар розилиги',
        'Қариндошлик ҳужжатлари',
      ],
      ru: [
        'Документы дарителя и одаряемого',
        'Правоустанавливающие документы на имущество',
        'Нотариальное согласие супруга и совладельцев',
        'Документы о родстве (для применения льгот)',
      ],
    },
    stateDuty: {
      uzLat: "Yaqin qarindoshlar (ota-ona, farzandlar, er-xotin, nabiralar, bobo-buvilar) o'rtasida — BHMning 0.5 baravari. Boshqa shaxslar o'rtasida — mulk turiga qarab umumiy oldi-sotdi stavkasida.",
      uzCyr: 'Яқин қариндошлар ўртасида — БҲМнинг 0.5 баравари. Бошқа шахсларда — умумий ставкада.',
      ru: 'Между близкими родственниками — 0.5 БРВ. Для посторонних лиц — по общим ставкам отчуждения.',
    },
  },

  // 6. NIKOH SHARTNOMASI (Prenuptial Agreement)
  {
    id: 'legal-nikoh-01',
    category: 'NIKOH_SHARTNOMASI',
    source: 'LEX_UZ',
    docNumber: '106785',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Oila kodeksi",
      uzCyr: 'Ўзбекистон Республикаси Оила кодекси',
      ru: 'Семейный кодекс Республики Узбекистан',
    },
    articleNumber: '29-36-moddalar',
    articleTitle: {
      uzLat: 'Nikoh shartnomasi, uning mazmuni va shakli',
      uzCyr: 'Никоҳ шартномаси, унинг мазмуни ва шакли',
      ru: 'Брачный договор, его содержание и форма',
    },
    keywords: ['nikoh shartnomasi', 'er-xotin', 'nikoh', 'birgalikdagi mulk', 'alohida mulk', 'никоҳ шартномаси', 'брачный договор', 'брак'],
    officialUrl: 'https://lex.uz/docs/106785#29',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Nikoh shartnomasi — nikohlanuvchi shaxslarning yoki er-xotinning nikohda bo'lgan davrida va (yoki) er-xotin nikohdan ajralgan taqdirda ularning mulkiy huquq hamda majburiyatlarini belgilovchi kelishuvidir. Nikoh shartnomasi yozma shaklda tuziladi va notarial tartibda tasdiqlanishi shart. Nikoh shartnomasi faqat mulkiy munosabatlarni tartibga soladi (shaxsiy nomulkiy huquqlarni, bolalarga bo'lgan munosabatlarni cheklash taqiqlanadi).",
      uzCyr: 'Никоҳ шартномаси — эр-хотиннинг мулкий ҳуқуқ ва мажбуриятларини белгиловчи келишув. Нотариал тартибда тасдиқланиши шарт. Фақат мулкий муносабатларни белгилайди.',
      ru: 'Брачный договор определяет имущественные права и обязанности супругов в браке и (или) в случае его расторжения. Подлежит обязательному нотариальному удостоверению. Регулирует исключительно имущественные отношения.',
    },
    requiredDocuments: {
      uzLat: [
        'Er va xotinning (yoki nikohlanuvchilarning) pasportlari / ID-kartalari',
        'Nikoh tuzilganligi to‘g‘risidagi guvohnoma (agar nikoh qayd etilgan bo‘lsa)',
        'Mavjud mol-mulk hujjatlari (shartnomaga kiritilayotgan bo‘lsa)',
      ],
      uzCyr: [
        'Паспорт/ID-карталар',
        'Никоҳ гувоҳномаси (агар никоҳдан ўтилган бўлса)',
        'Мол-мулк ҳужжатлари',
      ],
      ru: [
        'Паспорта / ID-карты супругов (или вступающих в брак)',
        'Свидетельство о заключении брака (если брак уже зарегистрирован)',
        'Документы на имущество, упоминаемое в договоре',
      ],
    },
    stateDuty: {
      uzLat: "BHMning 25 foizi (0.25 baravari) miqdorida davlat boji undiriladi.",
      uzCyr: 'БҲМнинг 0.25 баравари миқдорида давлат божи ундирилади.',
      ru: '0.25 БРВ (25% от базовой расчетной величины).',
    },
  },

  // 7. NOTARIAL TASDIQLASH VA QOIDALAR (Law on Notaries)
  {
    id: 'legal-notariat-01',
    category: 'NOTARIAL_TASDIQLASH',
    source: 'LEX_UZ',
    docNumber: '34304',
    docTitle: {
      uzLat: "O'zbekiston Respublikasining 'Notariat to'g'risida'gi Qonuni",
      uzCyr: "Ўзбекистон Республикасининг 'Нотариат тўғрисида'ги Қонуни",
      ru: "Закон Республики Узбекистан 'О нотариате'",
    },
    articleNumber: '1-34-moddalar',
    articleTitle: {
      uzLat: 'Notarial harakatlar va ularni amalga oshirishning asosiy qoidalari',
      uzCyr: 'Нотариал ҳаракатлар ва уларни амалга оширишнинг асосий қоидалари',
      ru: 'Нотариальные действия и основные правила их совершения',
    },
    keywords: ['notariat', 'notarius', 'notarial palata', 'xususiy notarius', 'harakat', 'sir', 'нотариат', 'нотариус', 'нотариальные действия'],
    officialUrl: 'https://lex.uz/docs/34304',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "O'zbekiston Respublikasida notarial harakatlar davlat notarial idoralari notariuslari hamda xususiy amaliyot bilan shug'ullanuvchi notariuslar tomonidan qonun hujjatlariga muvofiq amalga oshiriladi. Davlat va xususiy notariuslar tomonidan rasmiylashtirilgan hujjatlar bir xil yuridik kuchga ega. Notarius o'z faoliyatida mustaqildir va faqat qonunga bo'ysunadi. Notarial harakatlar siri qonun bilan himoyalanadi.",
      uzCyr: 'Нотариал ҳаракатлар давлат ва хусусий амалиёт билан шуғулланувчи нотариуслар томонидан амалга оширилади. Ҳужжатлар бир хил юридик кучга эга. Нотариус мустақил ва фақат қонунга бўйсунади.',
      ru: 'Нотариальные действия совершаются государственными и частнопрактикующими нотариусами. Оформленные ими документы имеют одинаковую юридическую силу. Тайна нотариальных действий гарантируется законом.',
    },
    stateDuty: {
      uzLat: "Barcha to'lovlar (davlat boji, gerb yig'imi va pullik xizmatlar) qat'iy ravishda elektron billing tizimi (kvitansiya) orqali amalga oshiriladi. Naqd pul berish taqiqlanadi.",
      uzCyr: 'Барча тўловлар электрон биллинг тизими орқали тўланади. Нақд пул бериш тақиқланади.',
      ru: 'Все платежи (госпошлина, гербовый сбор, платные услуги) оплачиваются строго через электронную биллинговую систему. Передача наличных денег запрещена.',
    },
  },

  // 8. DAVLAT BOJI VA NOTARIAL XARAJATLAR (State Duty Law)
  {
    id: 'legal-davlat-boji-01',
    category: 'DAVLAT_BOJI',
    source: 'LEX_UZ',
    docNumber: '4683889',
    docTitle: {
      uzLat: "O'zbekiston Respublikasining 'Davlat boji to'g'risida'gi Qonuni",
      uzCyr: "Ўзбекистон Республикасининг 'Давлат божи тўғрисида'ги Қонуни",
      ru: "Закон Республики Узбекистан 'О государственной пошлине'",
    },
    articleNumber: '5-modda va Ilova stavkalari',
    articleTitle: {
      uzLat: 'Notarial harakatlar uchun davlat boji stavkalari va imtiyozlar',
      uzCyr: 'Нотариал ҳаракатлар учун давлат божи ставкалари ва имтиёзлар',
      ru: 'Ставки государственной пошлины за совершение нотариальных действий и льготы',
    },
    keywords: ['davlat boji', 'stavka', 'to‘lov', 'bhm', 'imtiyoz', 'gerb yig‘imi', 'давлат божи', 'ставка', 'госпошлина', 'пошлина', 'льготы'],
    officialUrl: 'https://lex.uz/docs/4683889',
    cleanOfficialUrl: 'https://lex.uz/docs/4683889',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Notariuslar tomonidan notarial harakatlarni amalga oshirganlik uchun 'Davlat boji to'g'risida'gi Qonun bilan belgilangan qat'iy stavkalarda davlat boji undiriladi. Barcha hisob-kitoblar Bazaviy hisoblash miqdori (BHM) koeffitsiyentlarida amalga oshiriladi. 1- va 2-guruh nogironligi bo'lgan shaxslar, Ijtimoiy himoya yagona reyestridagi fuqarolar va yaqin qarindoshlar uchun qonunchilikda belgilangan imtiyozlar mavjud.",
      uzCyr: 'Нотариал ҳаракатлар учун қатъий белгиланган ставкаларда давлат божи ундирилади. Ҳисоб-китоб БҲМ асосида олиб борилади. Имтиёзли фуқаролар учун қонунда енгилликлар назарда тутилган.',
      ru: 'За совершение нотариальных действий взимается госпошлина по фиксированным ставкам в коэффициентах БРВ. Для близких родственников, лиц с инвалидностью 1 и 2 групп предусмотрены законодательные льготы.',
    },
    stateDuty: {
      uzLat: "Stavkalar notarial harakat turiga bog'liq (ishonchnoma — 0.5 dan 3 BHM, vasiyatnoma — 0.5 BHM, ko'chmas mulk — 1 dan 3 BHM).",
      uzCyr: 'Ставкалар нотариал ҳаракат турига қараб БҲМнинг 0.5 дан 3 бараваригача.',
      ru: 'Ставки зависят от вида действия: от 0.5 до 3 БРВ.',
    },
  },

  // 9. HUJJATLARNI RASMIYLASHTIRISH (Document Formalization / Duplicates / Travel Consent)
  {
    id: 'legal-hujjat-01',
    category: 'HUJJATLARNI_RASMIYLASHTIRISH',
    source: 'LEX_UZ',
    docNumber: '3159',
    docTitle: {
      uzLat: "Notariuslar tomonidan notarial harakatlarni amalga oshirish tartibi to'g'risidagi Yo'riqnoma",
      uzCyr: "Нотариуслар томонидан нотариал ҳаракатларни амалга ошириш тартиби тўғрисидаги Йўриқнома",
      ru: 'Инструкция о порядке совершения нотариальных действий нотариусами',
    },
    articleNumber: '7-bob',
    articleTitle: {
      uzLat: 'Hujjatlar dublikatini berish, tarjimalar to‘g‘riligini va imzo haqiqiyligini tasdiqlash',
      uzCyr: 'Ҳужжатлар дубликатини бериш, таржималар ва имзо ҳақиқийлигини тасдиқлаш',
      ru: 'Выдача дубликатов документов, свидетельствование верности перевода и подлинности подписи',
    },
    keywords: ['dublikat', 'hujjat rasmiylashtirish', 'tarjima', 'imzo', 'rozilik', 'chet elga chiqish', 'дубликат', 'таржима', 'имзо', 'согласие на выезд'],
    officialUrl: 'https://lex.uz/docs/4113470',
    cleanOfficialUrl: 'https://lex.uz/docs/4113470',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Yo'qolgan yoki yaroqsiz holga kelgan notarial tasdiqlangan hujjatlarning nusxasi (dublikati) notarial idora arxividan yoki elektron ma'lumotlar bazasidan arizaga asosan beriladi. Voyaga yetmagan bolaning xorijga chiqishi uchun ota-onasining notarial tasdiqlangan roziligi talab qilinadi. Shuningdek, notarius hujjatlarning bir tildan boshqa tilga tarjimasi to'g'riligini va fuqarolarning shaxsiy imzosining haqiqiyligini tasdiqlaydi.",
      uzCyr: 'Йўқолган нотариал ҳужжатларнинг дубликати архив ёки электрон тизимдан берилади. Болаларнинг чет элга чиқиши учун ота-онанинг нотариал розилиги талаб этилади.',
      ru: 'Дубликаты утраченных нотариальных документов выдаются из архива или электронной базы. Для выезда несовершеннолетних за границу оформляется нотариальное согласие родителей. Также нотариус свидетельствует подлинность подписи и верность перевода.',
    },
    requiredDocuments: {
      uzLat: [
        'Ariza beruvchining pasporti / ID-kartasi',
        'Yo‘qolgan hujjat ma’lumotlari (raqami, sanasi, notarius F.I.Sh.)',
        'Voyaga yetmagan bola uchun: tug‘ilganlik guvohnomasi va ota-onaning pasportlari',
      ],
      uzCyr: [
        'Аризачи паспорти / ID-картаси',
        'Ҳужжат маълумотлари',
        'Боланинг туғилганлик гувоҳномаси ва ота-она паспорти',
      ],
      ru: [
        'Паспорт / ID-карта заявителя',
        'Реквизиты утраченного документа',
        'Для выезда ребенка: свидетельство о рождении и паспорта родителей',
      ],
    },
    stateDuty: {
      uzLat: "Dublikat berish — BHMning 0.5 baravari; Imzo va tarjimani tasdiqlash — BHMning 0.1 dan 0.2 baravarigacha.",
      uzCyr: 'Дубликат бериш — БҲМнинг 0.5 баравари; имзо/таржима — 0.1-0.2 баравар.',
      ru: 'Выдача дубликата — 0.5 БРВ; свидетельствование подписи/перевода — 0.1-0.2 БРВ.',
    },
  },

  // 10. BOSHQA NOTARIAL XIZMATLAR (Other Notarial Services: Loans, Pledges, Executive Endorsements)
  {
    id: 'legal-boshqa-01',
    category: 'BOSHQA',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      uzCyr: 'Ўзбекистон Республикаси Fuqarolik kodeksi',
      ru: 'Гражданский кодекс Республики Узбекистан',
    },
    articleNumber: '732-743, 264-289-moddalar',
    articleTitle: {
      uzLat: 'Qarz, garov shartnomalari va ijro xatlarini yozish',
      uzCyr: 'Қарз, гаров шартномалари ва ижро хатларини ёзиш',
      ru: 'Договоры займа, залога и совершение исполнительных надписей',
    },
    keywords: ['qarz', 'garov', 'ijro xati', 'kafillik', 'depozit', 'omonat', 'boshqa xizmatlar', 'қарз', 'гаров', 'заем', 'залог', 'исполнительная надпись'],
    officialUrl: 'https://lex.uz/docs/111189#732',
    cleanOfficialUrl: 'https://lex.uz/docs/111189#732',
    verifiedDate: '2026-01-01',
    isCurrentEdition: true,
    legalStatus: 'IN_FORCE',
    content: {
      uzLat: "Fuqarolar o'rtasida BHMning 10 baravaridan ortiq miqdordagi qarz shartnomasi yozma shaklda tuzilishi lozim va taraflar xohishiga ko'ra notarial tasdiqlanishi mumkin. Notarial tasdiqlangan qarz yoki garov shartnomasi bo'yicha majburiyat bajarilmaganda, nizo sudga kiritilmasdan notariusning ijro xati orqali to'g'ridan-to'g'ri MIB organlari tomonidan undirilishi mumkin.",
      uzCyr: 'Қарз ва гаров шартномалари нотариал тасдиқланиши мумкин. Қарз тўланмаган тақдирда нотариуснинг ижро хати орқали МИБ томонидан ундирилади.',
      ru: 'Договоры займа и залога могут быть нотариально удостоверены. При неисполнении обязательства долг может быть взыскан в бесспорном порядке через исполнительную надпись нотариуса.',
    },
    requiredDocuments: {
      uzLat: [
        'Qarz beruvchi va oluvchining shaxsini tasdiqlovchi hujjatlari',
        'Garov ta’minoti mavjud bo‘lsa — mol-mulk huquqiy hujjatlari',
        'Turmush o‘rtog‘ining roziligi (garov qo‘yilayotgan bo‘lsa)',
      ],
      uzCyr: [
        'Тарафлар паспорт/ID-картаси',
        'Гаров мол-мулки ҳужжатлари',
        'Турмуш ўртоғи розилиги',
      ],
      ru: [
        'Паспорта сторон',
        'Документы на предмет залога',
        'Согласие супруга(и) при залоге общего имущества',
      ],
    },
    stateDuty: {
      uzLat: "Qarz summasiga qarab tabaqalashtirilgan (BHMning 0.5 foizidan 1 baravarigacha). Ijro xati yozish — undiriladigan summaning 1 foizi.",
      uzCyr: 'Қарз суммасига қараб БҲМнинг 0.5 дан 1 бараваригача. Ижро хати — ундириладиган сумманинг 1%.',
      ru: 'В зависимости от суммы займа (от 0.5 до 1 БРВ). Исполнительная надпись — 1% от суммы взыскания.',
    },
  },

  // 11. REPEALED DOCUMENT (Bekor qilingan hujjat - Test & Safety Guard)
  {
    id: 'legal-repealed-sample-01',
    category: 'NOTARIAL_TASDIQLASH',
    source: 'LEX_UZ',
    docNumber: 'OLD-NOTARY-RULES-1998',
    docTitle: {
      uzLat: "Eski notarial harakatlar yo'riqnomasi (O'z kuchini yo'qotgan)",
      uzCyr: 'Эски нотариал ҳаракатлар йўриқномаси (Ўз кучини йўқотган)',
      ru: 'Старая инструкция о нотариальных действиях (Утратила силу)',
    },
    articleNumber: '1-modda',
    articleTitle: {
      uzLat: 'Eski tartib',
      uzCyr: 'Эски тартиб',
      ru: 'Старый порядок',
    },
    keywords: ['eski qoida', 'kuchini yoqotgan qonun', 'bekor qilingan'],
    officialUrl: 'https://lex.uz/docs/9999999',
    cleanOfficialUrl: 'https://lex.uz/docs/9999999',
    verifiedDate: '2020-01-01',
    isCurrentEdition: false,
    legalStatus: 'REPEALED',
    repealDate: '2020-01-01',
    content: {
      uzLat: "Ushbu normativ hujjat o'z kuchini yo'qotgan va amaldagi huquqiy munosabatlarda qo'llanilmaydi.",
      uzCyr: 'Ушбу норматив ҳужжат ўз кучини йўқотган ва қўлланилмайди.',
      ru: 'Данный нормативный акт утратил силу и не подлежит применению.',
    },
  },

  // 12. HISTORICAL EDITION SAMPLE (Tarixiy tahrir - ONDATE param test)
  {
    id: 'legal-historical-sample-01',
    category: 'MEROS',
    source: 'LEX_UZ',
    docNumber: '111189',
    docTitle: {
      uzLat: "O'zbekiston Respublikasi Fuqarolik kodeksi (Tarixiy tahrir)",
      uzCyr: 'Ўзбекистон Республикаси Fuqarolik kodeksi (Тарихий таҳрир)',
      ru: 'Гражданский кодекс Республики Узбекистан (Историческая редакция)',
    },
    articleNumber: '1146-modda',
    articleTitle: {
      uzLat: 'Meros qabul qilish (Eski tahrir)',
      uzCyr: 'Мерос қабул қилиш (Эски таҳрир)',
      ru: 'Принятие наследства (Старая редакция)',
    },
    keywords: ['tarixiy tahrir', 'ondate test', 'eski tahrir meros'],
    officialUrl: 'https://lex.uz/docs/111189?ONDATE=01.01.2010',
    cleanOfficialUrl: 'https://lex.uz/docs/111189#1146',
    verifiedDate: '2010-01-01',
    isCurrentEdition: false,
    legalStatus: 'HISTORICAL_EDITION',
    content: {
      uzLat: "Bu qonunning 2010-yil 1-yanvardagi tarixiy tahriri bo'lib, hozirgi kunda amaldagi qonun sifatida qo'llanilmaydi.",
      uzCyr: 'Бу қонуннинг тарихий таҳрири бўлиб, амалдаги қонун сифатида қўлланилмайди.',
      ru: 'Это историческая редакция закона от 2010 года, не действующая в настоящее время.',
    },
  },
];

