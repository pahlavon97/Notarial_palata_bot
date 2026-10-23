import { ENotariusProvider } from '../../src/providers/e-notarius.provider';
import { NotaryDirectoryService } from '../../src/services/notary-directory.service';

describe('E-Notarius Official Flow: Region -> District -> Notaries Tests', () => {
  let provider: ENotariusProvider;
  let service: NotaryDirectoryService;

  beforeEach(() => {
    provider = new ENotariusProvider();
    service = new NotaryDirectoryService(provider);
  });

  describe('1. Region Selection & Validation', () => {
    it('should return all 14 official administrative regions with exact official IDs', () => {
      const regions = service.getRegions();
      expect(regions.length).toBe(14);

      // Verify Toshkent shahri and Toshkent viloyati are strictly separated
      const tshCity = regions.find((r) => r.id === 10);
      const tshRegion = regions.find((r) => r.id === 11);
      const andijan = regions.find((r) => r.id === 17);

      expect(tshCity).toBeDefined();
      expect(tshCity?.code).toBe('tashkent_city');
      expect(tshCity?.nameUzLat).toBe('Toshkent shahri');

      expect(tshRegion).toBeDefined();
      expect(tshRegion?.code).toBe('tashkent_region');
      expect(tshRegion?.nameUzLat).toBe('Toshkent viloyati');

      expect(andijan).toBeDefined();
      expect(andijan?.code).toBe('andijan');
      expect(andijan?.nameUzLat).toBe('Andijon viloyati');
    });

    it('should find regions by either numeric ID or string code', () => {
      expect(service.getRegionById(10)?.nameUzLat).toBe('Toshkent shahri');
      expect(service.getRegionById('10')?.nameUzLat).toBe('Toshkent shahri');
      expect(service.getRegionById('tashkent_city')?.nameUzLat).toBe('Toshkent shahri');

      expect(service.getRegionById(11)?.nameUzLat).toBe('Toshkent viloyati');
      expect(service.getRegionById('tashkent_region')?.nameUzLat).toBe('Toshkent viloyati');

      expect(service.getRegionById(17)?.nameUzLat).toBe('Andijon viloyati');
      expect(service.getRegionById('andijan')?.nameUzLat).toBe('Andijon viloyati');
    });
  });

  describe('2. District Selection by Region (Tashkent City, Tashkent Region, Andijan)', () => {
    it('should retrieve districts for Toshkent shahri including Yashnobod', async () => {
      const districts = await service.getDistrictsByRegion(10);
      expect(districts.length).toBe(12);

      const yashnobod = districts.find((d) => d.id === 1004 || d.nameUzLat.includes('Yashnobod'));
      expect(yashnobod).toBeDefined();
      expect(yashnobod?.id).toBe(1004);
      expect(yashnobod?.nameUzLat).toContain('Yashnobod');
    });

    it('should retrieve districts for Toshkent viloyati (23 districts/cities)', async () => {
      const districts = await service.getDistrictsByRegion(11);
      expect(districts.length).toBe(23);

      const angren = districts.find((d) => d.nameUzLat.includes('Angren'));
      const chirchiq = districts.find((d) => d.nameUzLat.includes('Chirchiq'));
      expect(angren).toBeDefined();
      expect(chirchiq).toBeDefined();
    });

    it('should retrieve districts for Andijon viloyati (19 districts/cities)', async () => {
      const districts = await service.getDistrictsByRegion(17);
      expect(districts.length).toBe(19);

      const andijanCity = districts.find((d) => d.nameUzLat.includes('Andijon shahri'));
      const asaka = districts.find((d) => d.nameUzLat.includes('Asaka'));
      expect(andijanCity).toBeDefined();
      expect(asaka).toBeDefined();
    });
  });

  describe('3. Notaries Search in Yashnobod (Toshkent shahri)', () => {
    it('should search notaries in Toshkent shahri, Yashnobod tumani with all required fields', async () => {
      const result = await service.searchNotariesByDistrict(10, 1004, 1, 3);
      expect(result.regionId).toBe(10);
      expect(result.districtId).toBe(1004);
      expect(result.districtName).toContain('Yashnobod');
      expect(result.notaries.length).toBeGreaterThan(0);

      const notary = result.notaries[0]!;
      // Requirements: F.I.Sh., to‘liq manzil, telefon, ish vaqti, rasmiy profil havolasi
      expect(notary.fullName).toBeDefined();
      expect(notary.fullName.length).toBeGreaterThan(3);
      expect(notary.address).toBeDefined();
      expect(notary.phone).toBeDefined();
      expect(notary.workingHours).toBeDefined();
      expect(notary.officialUrl).toContain('https://e-notarius.uz/notary/');
    });

    it('should format notary card in multiple languages', () => {
      const mockNotary = {
        id: '23920',
        regionId: '10',
        districtId: '1004',
        districtName: 'Yashnobod tumani',
        fullName: 'VAPAYEVA YORQINOY MATYAKUBOVNA',
        officeName: 'Yashnobod tumani xususiy notarius',
        licenseNumber: 'L-664234',
        address: 'Tuzel 2-mavze, 12 B-uy',
        phone: '+998 90 975 00 72',
        workingHours: 'Seshanba - Shanba: 11:00 - 17:00',
        officialUrl: 'https://e-notarius.uz/notary/23920',
        verifiedAt: '2026-01-15',
      };

      const cardLat = service.formatNotaryCard(mockNotary, 'UZ_LATIN');
      expect(cardLat).toContain('VAPAYEVA YORQINOY MATYAKUBOVNA');
      expect(cardLat).toContain('Tuzel 2-mavze');
      expect(cardLat).toContain('+998 90 975 00 72');
      expect(cardLat).toContain('Seshanba - Shanba: 11:00 - 17:00');
      expect(cardLat).toContain('https://e-notarius.uz/notary/23920');

      const cardRu = service.formatNotaryCard(mockNotary, 'RU');
      expect(cardRu).toContain('Нотариус:');
      expect(cardRu).toContain('Адрес:');
      expect(cardRu).toContain('Телефон:');
    });
  });

  describe('4. Pagination & Navigation', () => {
    it('should correctly calculate total pages and page numbers', async () => {
      const result = await service.searchNotariesByDistrict(10, 1004, 1, 3);
      expect(result.page).toBe(1);
      if (result.total > 0) {
        expect(result.totalPages).toBe(Math.ceil(result.total / 3));
      }
    });

    it('should format full page text with total count and page indicators', async () => {
      const result = await service.searchNotariesByDistrict(10, 1004, 1, 3);
      const pageText = service.formatNotariesPage(result, 'UZ_LATIN');
      expect(pageText).toContain('Yashnobod tumani');
      expect(pageText).toContain('Rasmiy notariuslar ro‘yxati');
      expect(pageText).toContain('Sahifa: 1/');
    });
  });

  describe('5. Error, Offline & Degraded State Handling', () => {
    it('should handle invalid region safely without crashing', async () => {
      const result = await service.searchNotariesByDistrict(999, 9999);
      expect(result.notaries).toEqual([]);
      expect(result.errorMessage).toBe('INVALID_REGION');
    });

    it('should provide official fallback portal URL and not falsely claim notaries do not exist on network error', async () => {
      jest.spyOn(provider, 'searchNotariesByDistrict').mockResolvedValue({
        notaries: [],
        total: 0,
        page: 1,
        totalPages: 0,
        regionId: 10,
        districtId: 1004,
        regionName: 'Toshkent shahri',
        districtName: 'Yashnobod tumani',
        isDegraded: true,
        errorMessage: 'NETWORK_ERROR',
      });

      const res = await service.searchNotariesByDistrict(10, 1004);
      expect(res.isDegraded).toBe(true);
      expect(res.errorMessage).toBe('NETWORK_ERROR');

      const fallbackUrl = provider.getSearchFallbackUrl(10, 1004);
      expect(fallbackUrl).toContain('https://e-notarius.uz');
    });
  });
});
