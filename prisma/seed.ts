import { PrismaClient, Language, LegalCategory, LegalSourceCode } from '@prisma/client';
import { VERIFIED_LEGAL_CORPUS } from '../src/database/legal-corpus.data';
import { VERIFIED_NOTARIES } from '../src/providers/e-notarius.provider';
import { REGIONS_OF_UZBEKISTAN, OFFICIAL_URLS } from '../src/config/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Notarial Palata Bot...');

  // 1. Seed Legal Sources
  const lexSource = await prisma.legalSource.upsert({
    where: { code: LegalSourceCode.LEX_UZ },
    update: {},
    create: {
      code: LegalSourceCode.LEX_UZ,
      name: "Lex.uz — O'zbekiston Respublikasi Qonunchilik ma'lumotlari milliy bazasi",
      baseUrl: OFFICIAL_URLS.LEX_UZ_HOME,
      description: 'Rasmiy normativ-huquqiy hujjatlar davlat portali',
      isActive: true,
      lastCheckedAt: new Date(),
    },
  });

  const adviceSource = await prisma.legalSource.upsert({
    where: { code: LegalSourceCode.ADVICE_UZ },
    update: {},
    create: {
      code: LegalSourceCode.ADVICE_UZ,
      name: "Advice.uz — O'zbekiston Respublikasi bepul huquqiy axborot portali",
      baseUrl: 'https://advice.uz/',
      description: "Fuqarolar uchun tushunarli huquqiy maslahatlar va 701-kategoriya (notarial xizmatlar)",
      isActive: true,
      lastCheckedAt: new Date(),
    },
  });

  const eNotariusSource = await prisma.legalSource.upsert({
    where: { code: LegalSourceCode.E_NOTARIUS },
    update: {},
    create: {
      code: LegalSourceCode.E_NOTARIUS,
      name: 'E-Notarius — O‘zbekiston elektron notariusi axborot tizimi',
      baseUrl: OFFICIAL_URLS.E_NOTARIUS_HOME,
      description: 'Notariuslar reestri va elektron navbatga yozilish portali',
      isActive: true,
      lastCheckedAt: new Date(),
    },
  });

  console.log('✅ Legal sources seeded.');

  // 2. Seed Verified Legal Documents & Articles
  for (const item of VERIFIED_LEGAL_CORPUS) {
    const sourceId = item.source === 'LEX_UZ' ? lexSource.id : adviceSource.id;

    const doc = await prisma.legalDocument.create({
      data: {
        sourceId,
        titleUzLat: item.docTitle.uzLat,
        titleUzCyrillic: item.docTitle.uzCyr,
        titleRu: item.docTitle.ru,
        docNumber: item.docNumber,
        category: item.category as LegalCategory,
        officialUrl: item.officialUrl,
        isCurrentEdition: item.isCurrentEdition,
        summaryUzLatin: item.content.uzLat,
        summaryUzCyrillic: item.content.uzCyr,
        summaryRu: item.content.ru,
        articles: {
          create: {
            articleNumber: item.articleNumber,
            titleUzLat: item.articleTitle.uzLat,
            titleUzCyrillic: item.articleTitle.uzCyr,
            titleRu: item.articleTitle.ru,
            contentUzLatin: item.content.uzLat,
            contentUzCyrillic: item.content.uzCyr,
            contentRu: item.content.ru,
            officialUrl: item.officialUrl,
            tags: item.keywords,
          },
        },
      },
    });
  }
  console.log(`✅ Seeded ${VERIFIED_LEGAL_CORPUS.length} verified legal documents and articles.`);

  // 3. Seed Notaries
  for (const notary of VERIFIED_NOTARIES) {
    const regionObj = REGIONS_OF_UZBEKISTAN.find((r) => r.id === notary.regionId);
    const regionName = regionObj ? regionObj.nameUzLat : notary.regionId;

    await prisma.notaryOffice.create({
      data: {
        region: regionName,
        district: notary.districtName,
        fullName: notary.fullName,
        licenseNumber: notary.licenseNumber,
        address: notary.address,
        phone: notary.phone,
        workingHours: notary.workingHours,
        officialUrl: notary.officialUrl,
        verifiedAt: new Date(notary.verifiedAt),
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${VERIFIED_NOTARIES.length} verified notaries into directory.`);
  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
