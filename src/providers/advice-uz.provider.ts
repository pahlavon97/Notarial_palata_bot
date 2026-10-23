import { BaseProvider } from './base.provider';
import { OFFICIAL_URLS } from '../config/constants';
import { SsrfGuard } from '../security/ssrf-guard';

export interface AdviceNormativeActReference {
  title: string;
  docNumber?: string;
  article?: string;
  lexUrl?: string;
}

export interface AdviceUzArticle {
  id: string;
  category: string;
  titleUzLat: string;
  titleUzCyr: string;
  titleRu: string;
  contentUzLat: string;
  contentUzCyr: string;
  contentRu: string;
  stepsUzLat: string[];
  stepsUzCyr: string[];
  stepsRu: string[];
  requiredDocsUzLat: string[];
  requiredDocsUzCyr: string[];
  requiredDocsRu: string[];
  officialUrl: string;
  canonicalUrl: string;
  publishedDate?: string;
  updatedDate?: string;
  lastVerifiedAt: string;
  isVerifiedCurrent: boolean;
  relatedNormativeActs: AdviceNormativeActReference[];
  discrepancyNote?: {
    uzLat?: string;
    uzCyr?: string;
    ru?: string;
  };
}

export interface AdviceGuide {
  id: string;
  category: string;
  titleUzLat: string;
  titleUzCyr: string;
  titleRu: string;
  stepsUzLat: string[];
  stepsUzCyr: string[];
  stepsRu: string[];
  requiredDocsUzLat: string[];
  requiredDocsUzCyr: string[];
  requiredDocsRu: string[];
  officialUrl: string;
  lastVerified: string;
}

export const COMPREHENSIVE_ADVICE_ARTICLES: AdviceUzArticle[] = [
  // 1. MEROS VA VASIYATNOMA
  {
    id: 'advice-cat-701-meros',
    category: 'MEROS',
    titleUzLat: 'Merosni rasmiylashtirish va vasiyatnoma bo‘yicha qo‘llanma',
    titleUzCyr: 'Меросни расмийлаштириш ва васиятнома бўйича қўлланма',
    titleRu: 'Пошаговое руководство по оформлению наследства и завещания',
    contentUzLat:
      'Meros ochilgan kundan boshlab 6 oy ichida meros qoldiruvchining oxirgi yashash joyidagi notarial idoraga murojaat qilib, merosni qabul qilish haqida ariza berish shart. Vasiyatnoma mavjud bo‘lsa, u vasiyat qilingan shaxslarga beriladi, biroq voyaga yetmagan yoki mehnatga layoqatsiz farzandlar, ota-ona va er-xotin qonun bo‘yicha ulushning kamida yarmini (majburiy ulush) olish huquqiga ega.',
    contentUzCyr:
      'Мерос очилган кундан бошлаб 6 ой ичида нотариусга ариза бериш шарт. Васиятнома бўлса ҳам, вояга етмаган ва меҳнатга лаёқатсиз яқинлар мажбурий улуш олиш ҳуқуқига эга.',
    contentRu:
      'Заявление о принятии наследства подается нотариусу в течение 6 месяцев со дня открытия наследства. При наличии завещания несовершеннолетние или нетрудоспособные наследники имеют право на обязательную долю (не менее половины доли по закону).',
    stepsUzLat: [
      '1. Meros qoldiruvchining oxirgi yashash joyi bo‘yicha notarial idoraga 6 oy ichida murojaat qiling.',
      '2. Merosni qabul qilish to‘g‘risida ariza bering.',
      '3. Kerakli hujjatlarni (qarindoshlik, mulk, o‘lim guvohnomasi) notariusga taqdim eting.',
      '4. Belgilangan davlat boji va gerb yig‘imini to‘lang.',
      '5. 6 oy o‘tgach Meros guvohnomasini qabul qilib oling.',
    ],
    stepsUzCyr: [
      '1. Мерос қолдирувчининг охирги яшаш жойидаги нотариусга 6 ой ичида мурожаат қилинг.',
      '2. Меросни қабул қилиш тўғрисида ариза беринг.',
      '3. Керакли ҳужжатларни тақдим этинг.',
      '4. Давлат божини тўланг.',
      '5. 6 ой ўтгач Мерос гувоҳномасини олинг.',
    ],
    stepsRu: [
      '1. Обратитесь к нотариусу по последнему месту жительства наследодателя в течение 6 месяцев.',
      '2. Подайте заявление о принятии наследства.',
      '3. Предоставьте правоустанавливающие и родственные документы.',
      '4. Оплатите госпошлину по квитанции.',
      '5. По истечении 6 месяцев получите свидетельство о праве на наследство.',
    ],
    requiredDocsUzLat: [
      'O‘lim to‘g‘risidagi guvohnoma',
      'Merosxo‘rning pasporti / ID-kartasi',
      'Tug‘ilganlik va nikoh guvohnomalari',
      'Mulk kadastri / texpasporti',
      'Vasiyatnoma (mavjud bo‘lsa)',
    ],
    requiredDocsUzCyr: [
      'Ўлим гувоҳномаси',
      'Паспорт / ID-карта',
      'Туғилганлик ва никоҳ гувоҳномалари',
      'Мулк кадастри / техпаспорти',
      'Васиятнома (мавжуд бўлса)',
    ],
    requiredDocsRu: [
      'Свидетельство о смерти',
      'Паспорт / ID-карта наследника',
      'Свидетельства о рождении и браке',
      'Кадастр / техпаспорт на имущество',
      'Завещание (при наличии)',
    ],
    officialUrl: 'https://advice.uz/uz/document/2603',
    canonicalUrl: 'https://advice.uz/uz/document/2603',
    publishedDate: '2024-01-15',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'O‘zbekiston Respublikasi Fuqarolik kodeksi',
        docNumber: '111189',
        article: '1146, 1147-moddalar',
        lexUrl: 'https://lex.uz/docs/111189#1146',
      },
    ],
  },

  // 2. AVTOMOBIL OLDI-SOTDISI
  {
    id: 'advice-cat-701-avto',
    category: 'AVTOMOBIL',
    titleUzLat: 'Avtomobil oldi-sotdisini rasmiylashtirish tartibi',
    titleUzCyr: 'Автомобиль олди-сотдисини расмийлаштириш тартиби',
    titleRu: 'Порядок оформления купли-продажи автомобиля',
    contentUzLat:
      'Avtotransport vositasini sotish, ayirboshlash yoki hadya qilish shartnomalari notarial idorada yoki E-Notarius portali orqali videoaloqa rejimida tasdiqlanishi mumkin. Notarius avtomobilning garovda, taqiqda yoki qidiruvda emasligini real vaqt rejimida tekshiradi. Shartnoma tasdiqlangach, 10 kun ichida YHXX organlarida ro‘yxatdan o‘tkaziladi.',
    contentUzCyr:
      'Автомобиль олди-сотдиси ихтиёрий нотариус ёки E-Notarius орқали видеоалоқада расмийлаштирилади. Нотариус тақиқни электрон тизимда текширади. 10 кунда ЙҲХХда рўйхатдан ўтказилади.',
    contentRu:
      'Договор купли-продажи автомобиля оформляется у любого нотариуса или онлайн через видеосвязь на портале E-Notarius. Нотариус проверяет отсутствие ареста и запретов. Регистрация в СБДД производится в течение 10 дней.',
    stepsUzLat: [
      '1. Sotuvchi va sotib oluvchi shaxsini tasdiqlovchi hujjatlar bilan ixtiyoriy notariusga boradi.',
      '2. Notarius avtomobilning taqiqda emasligi va jarimalarini elektron tizimdan tekshiradi.',
      '3. Turmush o‘rtoqlarining roziligi tasdiqlanadi.',
      '4. Davlat boji to‘lanib, oldi-sotdi shartnomasi imzolanadi va tasdiqlanadi.',
      '5. 10 kun ichida YHXX (GAI)da yangi texpasport rasmiylashtiriladi.',
    ],
    stepsUzCyr: [
      '1. Сотувчи ва олувчи нотариусга мурожаат қилади.',
      '2. Нотариус автомобилни тақиқ ва жарималардан текширади.',
      '3. Турмуш ўртоқлар розилиги тасдиқланади.',
      '4. Давлат божи тўланиб, шартнома тасдиқланади.',
      '5. 10 кун ичида ЙҲХХда янги техпаспорт олинади.',
    ],
    stepsRu: [
      '1. Продавец и покупатель обращаются к любому нотариусу с документами.',
      '2. Нотариус проверяет наличие ареста, залога и штрафов через базу данных.',
      '3. Оформляется согласие супругов при необходимости.',
      '4. Оплачивается госпошлина и подписывается договор купли-продажи.',
      '5. В течение 10 дней автомобиль регистрируется в органах СБДД (ГАИ).',
    ],
    requiredDocsUzLat: [
      'Pasportlar / ID-kartalar',
      'Avtomobil texpasporti',
      'Er/xotinning notarial roziligi (zarur bo‘lsa)',
    ],
    requiredDocsUzCyr: [
      'Паспортлар / ID-карталар',
      'Автомобиль техпаспорти',
      'Эр/хотин розилиги',
    ],
    requiredDocsRu: [
      'Паспорта / ID-карты сторон',
      'Техпаспорт автомобиля',
      'Согласие супруга(и)',
    ],
    officialUrl: 'https://advice.uz/uz/document/1897',
    canonicalUrl: 'https://advice.uz/uz/document/1897',
    publishedDate: '2024-02-10',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Davlat boji to‘g‘risidagi Qonun',
        docNumber: '4683889',
        article: 'Notarial stavkalar',
        lexUrl: 'https://lex.uz/docs/4683889',
      },
    ],
  },

  // 3. ISHONCHNOMA
  {
    id: 'advice-cat-701-ishonchnoma',
    category: 'ISHONCHNOMA',
    titleUzLat: 'Ishonchnomalarni rasmiylashtirish va bekor qilish tartibi',
    titleUzCyr: 'Ишончномаларни расмийлаштириш ва бекор қилиш тартиби',
    titleRu: 'Порядок оформления и отмены доверенностей',
    contentUzLat:
      'Ishonchnoma ko‘pi bilan 3 yil muddatga berilishi mumkin. Agar muddat ko‘rsatilmagan bo‘lsa, u 1 yil davomida amal qiladi. Berilgan sanasi ko‘rsatilmagan ishonchnoma haqiqiy emas. Avtotransport vositasini boshqarish va tasarruf etish ishonchnomalari E-Notarius portali orqali videotasdiqlash asosida ham berilishi mumkin.',
    contentUzCyr:
      'Ишончнома кўпи билан 3 йилга берилади. Муддат кўрсатилмаса 1 йил амал қилади. Санасиз ишончнома ҳақиқий эмас. Авто ишончномалари онлайн E-Notarius орқали ҳам расмийлаштирилади.',
    contentRu:
      'Доверенность выдается на срок не более 3 лет. Без указания срока действует 1 год. Без даты совершения доверенность недействительна. Доверенность на авто можно оформить онлайн через E-Notarius.',
    stepsUzLat: [
      '1. Ishonch bildiruvchi o‘z pasporti va ishonchli shaxs ma’lumotlari bilan notariusga keladi.',
      '2. Ishonchnoma matni va vakolatlar hajmi (boshqarish, sotish, sudlarda vakillik) kelishiladi.',
      '3. Mulk bo‘yicha bo‘lsa — mulk hujjati ko‘rsatiladi.',
      '4. Davlat boji to‘lanib, ishonchnoma tasdiqlanadi va reyestrga kiritiladi.',
    ],
    stepsUzCyr: [
      '1. Ишонч билдирувчи паспорт ва ишончли шахс маълумотлари билан нотариусга мурожаат қилади.',
      '2. Ваколатлар доираси белгиланади.',
      '3. Мулк ҳужжати тақдим этилади.',
      '4. Давлат божи тўланиб, ишончнома тасдиқланади.',
    ],
    stepsRu: [
      '1. Доверитель обращается к нотариусу с паспортом и данными представителя.',
      '2. Определяется объем полномочий.',
      '3. Предоставляются документы на имущество.',
      '4. Оплачивается госпошлина и документ вносится в реестр.',
    ],
    requiredDocsUzLat: [
      'Ishonch bildiruvchining pasporti / ID-kartasi',
      'Ishonchli shaxsning pasport ma’lumotlari (nusxasi yoki JShShIR)',
      'Mulk hujjatlari (avto yoki ko‘chmas mulk uchun)',
    ],
    requiredDocsUzCyr: [
      'Ишонч билдирувчининг паспорти',
      'Ишончли шахс маълумотлари',
      'Мулк ҳужжатлари',
    ],
    requiredDocsRu: [
      'Паспорт доверителя',
      'Данные поверенного',
      'Документы на имущество',
    ],
    officialUrl: 'https://advice.uz/uz/document/1899',
    canonicalUrl: 'https://advice.uz/uz/document/1899',
    publishedDate: '2024-03-01',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Fuqarolik kodeksi',
        docNumber: '111189',
        article: '134-144-moddalar',
        lexUrl: 'https://lex.uz/docs/111189#139',
      },
    ],
  },

  // 4. UY-JOY VA KO'CHMAS MULK
  {
    id: 'advice-cat-701-uyjoy',
    category: 'UY_JOY',
    titleUzLat: 'Uy-joy va ko‘chmas mulk oldi-sotdi shartnomasini tasdiqlash',
    titleUzCyr: 'Уй-жой ва кўчмас мулк олди-сотди шартномасини тасдиқлаш',
    titleRu: 'Удостоверение договоров отчуждения жилья и недвижимости',
    contentUzLat:
      'Ko‘chmas mulk oldi-sotdisi notarial tasdiqlanishi shart. Notarius soliq, kommunal qarzdorlik, taqiq yoki xatlov bor-yo‘qligini idoralararo elektron tizim orqali mustaqil tekshiradi. Doimiy ro‘yxatda turgan barcha shaxslar va turmush o‘rtog‘ining roziligi olinadi.',
    contentUzCyr:
      'Кўчмас мулк олди-сотдиси нотариал тасдиқланиши шарт. Нотариус қарздорлик ва тақиқларни электрон текширади. Рўйхатдаги барча шахслар ва турмуш ўртоғи розилиги талаб қилинади.',
    contentRu:
      'Сделки с недвижимостью подлежат обязательному нотариальному удостоверению. Нотариус проверяет коммунальные, налоговые долги и запреты. Требуется согласие супруга и прописанных совершеннолетних лиц.',
    stepsUzLat: [
      '1. Sotuvchi va xaridor kadastr va pasportlari bilan notariusga murojaat qiladi.',
      '2. Notarius elektron reyestrdan taqiq va qarzlarni tekshiradi.',
      '3. Ro‘yxatdagi a’zolar va er/xotin notarius huzurida rozilik beradi.',
      '4. Davlat boji to‘lanadi va shartnoma tasdiqlanadi.',
      '5. Notarius orqali to‘g‘ridan-to‘g‘ri Kadastr agentligiga davlat ro‘yxatidan o‘tkazishga yuboriladi.',
    ],
    stepsUzCyr: [
      '1. Тарафлар кадастр ва паспортлар билан нотариусга мурожаат қилади.',
      '2. Нотариус тақиқ ва қарзларни текширади.',
      '3. Оила аъзолари ва эр/хотин розилик беради.',
      '4. Давлат божи тўланиб, шартнома тасдиқланади.',
      '5. Кадастрга электрон юборилади.',
    ],
    stepsRu: [
      '1. Стороны обращаются к нотариусу с кадастровым паспортом.',
      '2. Проверяется отсутствие арестов и задолженностей.',
      '3. Оформляется согласие супругов и проживающих лиц.',
      '4. Оплачивается пошлина и заверяется сделка.',
      '5. Сведения автоматически направляются на регистрацию в Кадастр.',
    ],
    requiredDocsUzLat: [
      'Taraflarning pasportlari / ID-kartalari',
      'Mulkka egalik huquqini beruvchi hujjat va Kadastr pasporti',
      'Doimiy ro‘yxatda turuvchilar ma’lumotnomasi',
      'Turmush o‘rtoq va barcha ro‘yxatdagilarning notarial roziligi',
    ],
    requiredDocsUzCyr: [
      'Паспортлар / ID-карталар',
      'Кадастр паспорти ва мулк ҳужжати',
      'Прописка маълумотномаси',
      'Турмуш ўртоқ ва оила аъзолари розилиги',
    ],
    requiredDocsRu: [
      'Паспорта сторон',
      'Кадастровый паспорт и правоустанавливающий документ',
      'Справка о прописанных лицах',
      'Согласие супруга и членов семьи',
    ],
    officialUrl: 'https://advice.uz/uz/document/1966',
    canonicalUrl: 'https://advice.uz/uz/document/1966',
    publishedDate: '2024-01-20',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Fuqarolik kodeksi',
        docNumber: '111189',
        article: '479-488-moddalar',
        lexUrl: 'https://lex.uz/docs/111189#479',
      },
    ],
  },

  // 5. HADYA VA AYIRBOSHLASH
  {
    id: 'advice-cat-701-hadya',
    category: 'HADYA',
    titleUzLat: 'Hadya va ayirboshlash shartnomalarini rasmiylashtirish',
    titleUzCyr: 'Ҳадя ва айирбошлаш шартномаларини расмийлаштириш',
    titleRu: 'Оформление договоров дарения и мены',
    contentUzLat:
      'Hadya shartnomasida mol-mulk mutlaqo tekinga (beg‘araz) topshiriladi. Hadya qiluvchi shaxs evaziga hech qanday haq talab qilishi mumkin emas. Yaqin qarindoshlar o‘rtasidagi hadya shartnomalari uchun davlat boji imtiyozli miqdorda (BHMning 0.5 baravari) undiriladi.',
    contentUzCyr:
      'Ҳадя шартномасида мол-мулк текинга берилади. Қарши ҳақ талаб қилиш мумкин эмас. Яқин қариндошлар ўртасидаги ҳадя учун давлат божи БҲМнинг 0.5 бараварини ташкил этади.',
    contentRu:
      'По договору дарения имущество передается безвозмездно. Встречные требования запрещены. Между близкими родственниками госпошлина составляет льготные 0.5 БРВ.',
    stepsUzLat: [
      '1. Hadya qiluvchi va oluvchi notarial idoraga murojaat qiladi.',
      '2. Birgalikdagi mulkdorlarning notarial roziligi tasdiqlanadi.',
      '3. Qarindoshlik darajasi hujjatlar bilan isbotlanadi (imtiyoz uchun).',
      '4. Davlat boji to‘lanib, shartnoma tasdiqlanadi.',
    ],
    stepsUzCyr: [
      '1. Нотариусга мурожаат қилинади.',
      '2. Биргаликдаги мулкдорлар розилиги олинади.',
      '3. Қариндошлик тасдиқланади.',
      '4. Шартнома тасдиқланади.',
    ],
    stepsRu: [
      '1. Стороны обращаются к нотариусу.',
      '2. Оформляется согласие совладельцев имущества.',
      '3. Подтверждается родство для применения льготы.',
      '4. Оплачивается пошлина и заверяется договор.',
    ],
    requiredDocsUzLat: [
      'Hadya qiluvchi va oluvchi pasportlari',
      'Mulkka bo‘lgan huquqiy hujjatlar',
      'Qarindoshlikni tasdiqlovchi hujjatlar (tug‘ilganlik, nikoh)',
      'Turmush o‘rtoq roziligi',
    ],
    requiredDocsUzCyr: [
      'Паспортлар',
      'Мулк ҳужжатлари',
      'Қариндошлик гувоҳномалари',
      'Турмуш ўртоқ розилиги',
    ],
    requiredDocsRu: [
      'Паспорта дарителя и одаряемого',
      'Документы на имущество',
      'Свидетельства о родстве',
      'Согласие супруга(и)',
    ],
    officialUrl: 'https://advice.uz/uz/document/1897',
    canonicalUrl: 'https://advice.uz/uz/document/1897',
    publishedDate: '2024-02-15',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Fuqarolik kodeksi',
        docNumber: '111189',
        article: '502-511-moddalar',
        lexUrl: 'https://lex.uz/docs/111189#502',
      },
    ],
  },

  // 6. NIKOH SHARTNOMASI
  {
    id: 'advice-cat-701-nikoh',
    category: 'NIKOH_SHARTNOMASI',
    titleUzLat: 'Nikoh shartnomasi tuzish va uni o‘zgartirish tartibi',
    titleUzCyr: 'Никоҳ шартномаси тузиш ва уни ўзгартириш тартиби',
    titleRu: 'Порядок заключения и изменения брачного договора',
    contentUzLat:
      'Nikoh shartnomasi nikoh tuzilayotganda yoki nikoh davrida notarial tasdiqlangan holda tuziladi. Shartnomada faqat mulkiy huquqlar belgilanishi mumkin. Shaxsiy nomulkiy munosabatlarni yoki voyaga yetmagan bolalarga oid huquqlarni cheklovchi qoidalar kiritish qat’iyan taqiqlanadi.',
    contentUzCyr:
      'Никоҳ шартномаси нотариал тартибда тузилади. У фақат мулкий муносабатларни белгилайди. Шахсий номулкий ҳуқуқлар ва болалар ҳуқуқларини чеклаш тақиқланади.',
    contentRu:
      'Брачный договор подлежит обязательному нотариальному удостоверению. Регулирует исключительно имущественные права супругов. Ограничение неимущественных прав запрещено.',
    stepsUzLat: [
      '1. Er-xotin (yoki nikohlanuvchilar) shaxsiy hujjatlari bilan notariusga keladi.',
      '2. Shartnoma shartlari (birgalikdagi, ulushli yoki alohida mulk rejimi) muhokama qilinadi.',
      '3. Nikoh guvohnomasi (agar nikoh qayd etilgan bo‘lsa) taqdim etiladi.',
      '4. Davlat boji (BHMning 0.25 baravari) to‘lanib, shartnoma tasdiqlanadi.',
    ],
    stepsUzCyr: [
      '1. Эр-хотин нотариусга мурожаат қилади.',
      '2. Мулк режими шартлари келишилади.',
      '3. Никоҳ гувоҳномаси тақдим этилади.',
      '4. Давлат божи тўланиб, тасдиқланади.',
    ],
    stepsRu: [
      '1. Супруги обращаются к нотариусу.',
      '2. Согласовываются условия имущественного режима.',
      '3. Предоставляется свидетельство о браке.',
      '4. Оплачивается пошлина (0.25 БРВ) и заверяется договор.',
    ],
    requiredDocsUzLat: [
      'Er va xotinning pasportlari / ID-kartalari',
      'Nikoh tuzilganligi to‘g‘risidagi guvohnoma',
      'Mavjud ko‘chmas yoki ko‘char mulk hujjatlari',
    ],
    requiredDocsUzCyr: [
      'Паспортлар / ID-карталар',
      'Никоҳ гувоҳномаси',
      'Мулк ҳужжатлари',
    ],
    requiredDocsRu: [
      'Паспорта сторон',
      'Свидетельство о браке',
      'Документы на имеющееся имущество',
    ],
    officialUrl: 'https://advice.uz/uz/document/2600',
    canonicalUrl: 'https://advice.uz/uz/document/2600',
    publishedDate: '2024-03-05',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Oila kodeksi',
        docNumber: '106785',
        article: '29-36-moddalar',
        lexUrl: 'https://lex.uz/docs/106785#29',
      },
    ],
  },

  // 7. NOTARIAL TASDIQLASH VA UMUMIY TALABLAR
  {
    id: 'advice-cat-701-tasdiqlash',
    category: 'NOTARIAL_TASDIQLASH',
    titleUzLat: 'Notarial tasdiqlashning asosiy qoidalari va talablari',
    titleUzCyr: 'Нотариал тасдиқлашнинг асосий қоидалари ва талаблари',
    titleRu: 'Основные правила и требования нотариального удостоверения',
    contentUzLat:
      'Notarial harakatlar davlat va xususiy notariuslar tomonidan qonun hujjatlariga qat’iy muvofiq ravishda amalga oshiriladi. Davlat va xususiy notariuslar tasdiqlagan hujjatlar teng yuridik kuchga ega. Barcha to‘lovlar elektron billing orqali qabul qilinadi.',
    contentUzCyr:
      'Давлат ва хусусий нотариуслар томонидан тасдиқланган ҳужжатлар тенг кучга эга. Тўловлар электрон биллинг тизими орқали амалга оширилади.',
    contentRu:
      'Документы, удостоверенные государственными и частными нотариусами, имеют равную юридическую силу. Все платежи принимаются через электронный биллинг.',
    stepsUzLat: [
      '1. Notarius huzuriga shaxsni tasdiqlovchi hujjat bilan kelish.',
      '2. Taraflarning muomala layoqati va erki tekshiriladi.',
      '3. Hujjat matni o‘qib eshittiriladi va imzolanadi.',
      '4. Hujjat notarial reyestrga kiritiladi va QR-kod bilan ta’minlanadi.',
    ],
    stepsUzCyr: [
      '1. Паспорт билан нотариусга келиш.',
      '2. Муомала лаёқати ва ихтиёрийлик текширилади.',
      '3. Ҳужжат имзоланади.',
      '4. QR-код билан реестрга киритилади.',
    ],
    stepsRu: [
      '1. Обращение к нотариусу с паспортом.',
      '2. Проверка дееспособности и волеизъявления.',
      '3. Подписание документа.',
      '4. Регистрация в реестре с QR-кодом.',
    ],
    requiredDocsUzLat: ['Pasport / ID-karta', 'Notarial harakat turiga qarab tegishli hujjatlar'],
    requiredDocsUzCyr: ['Паспорт / ID-карта', 'Тегишли ҳужжатлар'],
    requiredDocsRu: ['Паспорт / ID-карта', 'Необходимые документы по сделке'],
    officialUrl: 'https://advice.uz/uz/document/1896',
    canonicalUrl: 'https://advice.uz/uz/document/1896',
    publishedDate: '2024-01-10',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Notariat to‘g‘risidagi Qonun',
        docNumber: '34304',
        article: '1-34-moddalar',
        lexUrl: 'https://lex.uz/docs/34304',
      },
    ],
  },

  // 8. DAVLAT BOJI VA NOTARIAL XARAJATLAR
  {
    id: 'advice-cat-701-davlatboji',
    category: 'DAVLAT_BOJI',
    titleUzLat: 'Notarial xizmatlar uchun davlat boji va to‘lovlar stavkalari',
    titleUzCyr: 'Нотариал хизматлар учун давлат божи ва тўловлар ставкалари',
    titleRu: 'Ставки госпошлины и сборов за совершение нотариальных действий',
    contentUzLat:
      'Notarial harakatlar uchun davlat boji Bazaviy hisoblash miqdori (BHM) koeffitsiyentlarida hisoblanadi. Shuningdek gerb yig‘imi va huquqiy-texnik xizmat haqi olinadi. 1- va 2-guruh nogironlari hamda yaqin qarindoshlar uchun belgilangan imtiyozlar mavjud.',
    contentUzCyr:
      'Давлат божи БҲМ асосида ҳисобланади. Имтиёзли тоифадаги шахслар учун қонунда енгилликлар мавжуд. Тўлов фақат квитанция орқали тўланади.',
    contentRu:
      'Госпошлина исчисляется в БРВ. Лицам с инвалидностью 1 и 2 групп и близким родственникам предоставляются льготы. Оплата строго по электронной квитанции.',
    stepsUzLat: [
      '1. Notarius hisoblab chiqqan to‘lov xabarnomasi (billing invoysi)ni olish.',
      '2. Bank ilovasi (Payme, Click, UPay) yoki bank kassasi orqali to‘lash.',
      '3. To‘lov tizimda avtomatik aks etadi va hujjat tasdiqlanadi.',
    ],
    stepsUzCyr: [
      '1. Биллинг инвойсини олиш.',
      '2. Банк иловаси ёки касса орқали тўлаш.',
      '3. Тўлов тизимда автоматик акс этади.',
    ],
    stepsRu: [
      '1. Получение биллингового инвойса.',
      '2. Оплата через банковские приложения или кассу.',
      '3. Автоматическое подтверждение оплаты в системе.',
    ],
    requiredDocsUzLat: [
      'Pasport / ID-karta',
      'Imtiyoz mavjud bo‘lsa — tasdiqlovchi guvohnoma (nogironlik, Ijtimoiy reyestr)',
    ],
    requiredDocsUzCyr: [
      'Паспорт',
      'Имтиёз ҳужжатлари',
    ],
    requiredDocsRu: [
      'Паспорт',
      'Документы о праве на льготу',
    ],
    officialUrl: 'https://advice.uz/uz/document/2187',
    canonicalUrl: 'https://advice.uz/uz/document/2187',
    publishedDate: '2024-01-25',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Davlat boji to‘g‘risidagi Qonun',
        docNumber: '4683889',
        article: '5-modda va Ilova',
        lexUrl: 'https://lex.uz/docs/4683889',
      },
    ],
  },

  // 9. HUJJATLARNI RASMIYLASHTIRISH
  {
    id: 'advice-cat-701-hujjatlar',
    category: 'HUJJATLARNI_RASMIYLASHTIRISH',
    titleUzLat: 'Hujjatlar dublikati, tarjimasi va voyaga yetmaganlar chiqishiga rozilik',
    titleUzCyr: 'Ҳужжатлар дубликати, таржимаси ва болалар чет элга чиқишига розилик',
    titleRu: 'Дубликаты документов, переводы и согласие на выезд несовершеннолетних',
    contentUzLat:
      'Yo‘qolgan hujjatlarning dublikati arxivdan olinadi. Voyaga yetmagan bolalar chet elga ketishida ota-ona notarial tasdiqlangan rozilik berishi shart. Notarius tarjimalar to‘g‘riligini va shaxslarning imzo haqiqiyligini tasdiqlab beradi.',
    contentUzCyr:
      'Йўқолган ҳужжат дубликати архивдан берилади. Болалар чет элга чиқиши учун ота-она нотариал розилиги талаб этилади. Имзо ва таржима ҳақиқийлиги нотариусда тасдиқланади.',
    contentRu:
      'Дубликаты утраченных документов выдаются из архива. Для выезда детей за границу оформляется согласие родителей. Нотариус свидетельствует подлинность подписи и перевод.',
    stepsUzLat: [
      '1. Ariza va pasport bilan notariusga murojaat qilish.',
      '2. Bola chet elga chiqishida ikkala ota-onaning shaxsiy ishtiroki yoki notarial roziligi taqdim etiladi.',
      '3. Matn rasmiylashtirilib, reyestrga kiritiladi.',
    ],
    stepsUzCyr: [
      '1. Ариза ва паспорт билан нотариусга келиш.',
      '2. Ота-онанинг паспортлари ва бола туғилганлик гувоҳномаси кўрсатилади.',
      '3. Ҳужжат тасдиқланади.',
    ],
    stepsRu: [
      '1. Обращение к нотариусу с паспортом.',
      '2. Предоставление свидетельства о рождении и документов родителей.',
      '3. Оформление нотариального согласия.',
    ],
    requiredDocsUzLat: [
      'Ota-ona pasportlari',
      'Bolaning tug‘ilganlik guvohnomasi / xorijga chiqish pasporti',
      'Dublikat uchun — yo‘qolgan hujjat rekvizitlari',
    ],
    requiredDocsUzCyr: [
      'Ота-она паспортлари',
      'Боланинг туғилганлик гувоҳномаси',
      'Ҳужжат реквизитлари',
    ],
    requiredDocsRu: [
      'Паспорта родителей',
      'Свидетельство о рождении ребенка',
      'Реквизиты документа для дубликата',
    ],
    officialUrl: 'https://advice.uz/uz/document/437',
    canonicalUrl: 'https://advice.uz/uz/document/437',
    publishedDate: '2024-02-01',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Notariuslar tomonidan notarial harakatlarni amalga oshirish Yo‘riqnomasi',
        docNumber: '3159',
        lexUrl: 'https://lex.uz/docs/4113470',
      },
    ],
  },

  // 10. BOSHQA NOTARIAL XIZMATLAR
  {
    id: 'advice-cat-701-boshqa',
    category: 'BOSHQA',
    titleUzLat: 'Boshqa notarial harakatlar: qarz, garov, depozit va ijro xatlari',
    titleUzCyr: 'Бошқа нотариал ҳаракатлар: қарз, гаров, депозит ва ижро хатлари',
    titleRu: 'Прочие нотариальные действия: займы, залоги, депозиты и исполнительные надписи',
    contentUzLat:
      'Qarz shartnomasi va garov shartnomalari ixtiyoriy ravishda notarial tasdiqlanadi. Notarial tasdiqlangan qarz shartnomasi bo‘yicha pul mablag‘lari qaytarilmagan hollarda, notarius tomonidan ijro xati yoziladi va qarz sud jarayonisiz to‘g‘ridan-to‘g‘ri MIB orqali undiriladi.',
    contentUzCyr:
      'Қарз ва гаров шартномалари нотариал тасдиқланса, қарз қайтарилмаганда судсиз ижро хати орқали МИБ томонидан ундирилади.',
    contentRu:
      'Нотариально удостоверенные договоры займа позволяют взыскивать задолженность в бесспорном порядке через исполнительную надпись нотариуса без судебного разбирательства.',
    stepsUzLat: [
      '1. Qarz beruvchi va oluvchi shaxsini tasdiqlovchi hujjatlar bilan notariusga keladi.',
      '2. Qarz summasi, qaytarish muddati va shartlari shartnomaga kiritiladi.',
      '3. To‘lov amalga oshirilgach, shartnoma tasdiqlanadi.',
      '4. Qarz to‘lanmagan taqdirda — kreditor ijro xati yozish uchun notariusga murojaat qiladi.',
    ],
    stepsUzCyr: [
      '1. Тарафлар нотариусга мурожаат қилади.',
      '2. Қарз шартлари белгиланади.',
      '3. Шартнома тасдиқланади.',
      '4. Тўланмаса — ижро хати олинади.',
    ],
    stepsRu: [
      '1. Стороны обращаются к нотариусу.',
      '2. Согласовываются сумма и условия возврата.',
      '3. Удостоверяется договор.',
      '4. При невозврате совершается исполнительная надпись.',
    ],
    requiredDocsUzLat: [
      'Qarz beruvchi va qarz oluvchi pasportlari',
      'Turmush o‘rtog‘ining roziligi (garov ta’minoti bo‘lsa)',
      'Garov mulki hujjatlari',
    ],
    requiredDocsUzCyr: [
      'Тарафлар паспортлари',
      'Гаров ҳужжатлари',
      'Турмуш ўртоқ розилиги',
    ],
    requiredDocsRu: [
      'Паспорта сторон',
      'Документы на предмет залога',
      'Согласие супруга(и)',
    ],
    officialUrl: 'https://advice.uz/uz/document/1964',
    canonicalUrl: 'https://advice.uz/uz/document/1964',
    publishedDate: '2024-02-18',
    updatedDate: '2026-01-01',
    lastVerifiedAt: '2026-01-01',
    isVerifiedCurrent: true,
    relatedNormativeActs: [
      {
        title: 'Fuqarolik kodeksi',
        docNumber: '111189',
        article: '732-743-moddalar',
        lexUrl: 'https://lex.uz/docs/111189#732',
      },
    ],
  },
];

// Backwards-compatible AdviceGuide representation
export const ADVICE_UZ_GUIDES: AdviceGuide[] = COMPREHENSIVE_ADVICE_ARTICLES.map((a) => ({
  id: a.id,
  category: a.category,
  titleUzLat: a.titleUzLat,
  titleUzCyr: a.titleUzCyr,
  titleRu: a.titleRu,
  stepsUzLat: a.stepsUzLat,
  stepsUzCyr: a.stepsUzCyr,
  stepsRu: a.stepsRu,
  requiredDocsUzLat: a.requiredDocsUzLat,
  requiredDocsUzCyr: a.requiredDocsUzCyr,
  requiredDocsRu: a.requiredDocsRu,
  officialUrl: OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY,
  lastVerified: a.lastVerifiedAt,
}));

export class AdviceUzProvider extends BaseProvider {
  private articlesStore: AdviceUzArticle[] = [...COMPREHENSIVE_ADVICE_ARTICLES];

  constructor(timeoutMs = 6000) {
    super('AdviceUzProvider', timeoutMs);
  }

  public getFallbackUrl(): string {
    return OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY;
  }

  /**
   * Safe fetcher with redirect resolution and strict SSRF allowlist check
   */
  public async fetchArticleSafely(targetUrl: string): Promise<AdviceUzArticle | null> {
    return this.executeWithTimeout(
      async () => {
        // SSRF guard check on initial target
        SsrfGuard.validateUrl(targetUrl);

        let currentUrl = targetUrl;
        let response = await fetch(currentUrl, { redirect: 'manual' });
        let redirectHops = 0;
        const maxRedirects = 5;

        // Safely follow redirects manually while validating each hop against whitelist
        while (response.status >= 300 && response.status < 400 && redirectHops < maxRedirects) {
          const location = response.headers.get('location');
          if (!location) break;

          const resolved = new URL(location, currentUrl).toString();
          // Validate redirect destination
          SsrfGuard.validateUrl(resolved);
          currentUrl = resolved;
          redirectHops++;
          response = await fetch(currentUrl, { redirect: 'manual' });
        }

        if (response.status !== 200) {
          this.logger.warn(`Fetch returned status ${response.status} for URL: ${currentUrl}`);
          return null;
        }

        const html = await response.text();
        const article = this.parseArticleHtml(html, currentUrl);
        if (article) {
          // Update or add to internal store
          const existingIdx = this.articlesStore.findIndex((a) => a.canonicalUrl === article.canonicalUrl);
          if (existingIdx >= 0) {
            this.articlesStore[existingIdx] = article;
          } else {
            this.articlesStore.push(article);
          }
        }
        return article;
      },
      () => null
    );
  }

  /**
   * Discovers internal article links within Advice.uz HTML structure
   */
  public extractArticleLinks(html: string, baseUrl = OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY): string[] {
    const links: string[] = [];
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;

    while ((match = hrefRegex.exec(html)) !== null) {
      const rawHref = match[1]?.trim();
      if (!rawHref) continue;

      try {
        let resolved: string;
        if (rawHref.startsWith('/')) {
          resolved = new URL(rawHref, baseUrl).toString();
        } else if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
          resolved = rawHref;
        } else {
          continue;
        }

        const validated = SsrfGuard.validateUrl(resolved);
        if (validated.hostname.endsWith('advice.uz') && (resolved.includes('/document/') || resolved.includes('/category/'))) {
          if (!links.includes(resolved)) {
            links.push(resolved);
          }
        }
      } catch {
        // Ignore invalid URL format
      }
    }

    return links;
  }

  /**
   * Parse HTML content from Advice.uz article page
   */
  public parseArticleHtml(html: string, url: string): AdviceUzArticle | null {
    try {
      // Find title: <h3 class="page-header">...</h3> or <h1>
      const titleMatch =
        html.match(/<h3[^>]*class=["'][^"']*page-header[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i) ||
        html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1]!.replace(/<[^>]+>/g, '').trim() : '';

      if (!title) return null;

      // Extract text content from <div class="page-document-content">
      const contentMatch = html.match(/<div[^>]*class=["'][^"']*page-document-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      const rawContent = contentMatch ? contentMatch[1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : title;

      // Extract publication / update date if present
      const dateMatch = html.match(/field-name-field-date[^>]*>([\s\S]*?)<\/div>/i) ||
                        html.match(/(\d{2}\.\d{2}\.\d{4})/);
      const pubDate = dateMatch ? (dateMatch[1] || dateMatch[0])!.replace(/<[^>]+>/g, '').trim() : '2026-01-01';

      // Find Lex.uz links in article text
      const lexLinks = [...html.matchAll(/href=["']([^"']*lex\.uz[^"']*)["']/gi)].map((m) => m[1]!);

      return {
        id: `advice-live-${encodeURIComponent(url)}`,
        category: 'NOTARIAL_TASDIQLASH',
        titleUzLat: title,
        titleUzCyr: title,
        titleRu: title,
        contentUzLat: rawContent.slice(0, 800),
        contentUzCyr: rawContent.slice(0, 800),
        contentRu: rawContent.slice(0, 800),
        stepsUzLat: [],
        stepsUzCyr: [],
        stepsRu: [],
        requiredDocsUzLat: [],
        requiredDocsUzCyr: [],
        requiredDocsRu: [],
        officialUrl: url,
        canonicalUrl: url,
        publishedDate: pubDate,
        updatedDate: pubDate,
        lastVerifiedAt: new Date().toISOString().split('T')[0] || '2026-01-01',
        isVerifiedCurrent: true,
        relatedNormativeActs: lexLinks.map((link) => ({
          title: 'Lex.uz normativ hujjati',
          lexUrl: link,
        })),
      };
    } catch {
      return null;
    }
  }

  /**
   * Search through Advice.uz articles across all 10 categories
   */
  public async searchArticles(query: string, categoryFilter?: string): Promise<AdviceUzArticle[]> {
    return this.executeWithTimeout(
      async () => {
        const clean = query.toLowerCase().trim();
        const stopWords = new Set([
          'qanday', 'qachon', 'qaerda', 'qayerda', 'uchun', 'bilan', 'haqida', 'nima', 'kerak', 'mumkin',
          'bormi', 'va', 'yoki', 'esa', 'ham', 'bu', 'shu', 'biz', 'siz',
          'как', 'где', 'когда', 'что', 'для', 'или', 'если', 'можно', 'нужно', 'ли'
        ]);
        const tokens = clean.split(/[\s,.;:!?]+/).filter((t) => t.length > 2 && !stopWords.has(t));

        if (tokens.length === 0 && !categoryFilter) {
          return [];
        }

        const results: { article: AdviceUzArticle; score: number }[] = [];

        for (const article of this.articlesStore) {
          if (categoryFilter && article.category !== categoryFilter) continue;

          let score = 0;
          const combined = (
            article.titleUzLat +
            ' ' +
            article.titleUzCyr +
            ' ' +
            article.titleRu +
            ' ' +
            article.contentUzLat +
            ' ' +
            article.contentUzCyr +
            ' ' +
            article.contentRu
          ).toLowerCase();

          if (clean.includes(article.category.toLowerCase())) {
            score += 10;
          }

          if (combined.includes(clean)) {
            score += 15;
          } else {
            for (const token of tokens) {
              if (token.length >= 4 && combined.includes(token)) {
                score += 4;
              }
            }
          }

          if (score >= 8) {
            results.push({ article, score });
          }
        }

        results.sort((a, b) => b.score - a.score);
        return results.map((r) => r.article);
      },
      () => []
    );
  }

  public async getArticleByCategory(category: string): Promise<AdviceUzArticle | null> {
    return this.executeWithTimeout(
      async () => {
        const article = this.articlesStore.find((a) => a.category === category);
        return article || null;
      },
      () => null
    );
  }

  /**
   * Backwards-compatible methods for existing code and tests
   */
  public async getGuideByCategory(category: string): Promise<AdviceGuide | null> {
    const article = await this.getArticleByCategory(category);
    if (!article) return null;
    return {
      id: article.id,
      category: article.category,
      titleUzLat: article.titleUzLat,
      titleUzCyr: article.titleUzCyr,
      titleRu: article.titleRu,
      stepsUzLat: article.stepsUzLat,
      stepsUzCyr: article.stepsUzCyr,
      stepsRu: article.stepsRu,
      requiredDocsUzLat: article.requiredDocsUzLat,
      requiredDocsUzCyr: article.requiredDocsUzCyr,
      requiredDocsRu: article.requiredDocsRu,
      officialUrl: OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY,
      lastVerified: article.lastVerifiedAt,
    };
  }

  public async searchGuides(query: string): Promise<AdviceGuide[]> {
    const articles = await this.searchArticles(query);
    return articles.map((article) => ({
      id: article.id,
      category: article.category,
      titleUzLat: article.titleUzLat,
      titleUzCyr: article.titleUzCyr,
      titleRu: article.titleRu,
      stepsUzLat: article.stepsUzLat,
      stepsUzCyr: article.stepsUzCyr,
      stepsRu: article.stepsRu,
      requiredDocsUzLat: article.requiredDocsUzLat,
      requiredDocsUzCyr: article.requiredDocsUzCyr,
      requiredDocsRu: article.requiredDocsRu,
      officialUrl: article.officialUrl,
      lastVerified: article.lastVerifiedAt,
    }));
  }
}

export const adviceUzProvider = new AdviceUzProvider();

