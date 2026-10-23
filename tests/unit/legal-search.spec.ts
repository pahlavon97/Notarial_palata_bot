import { LegalSearchService } from '../../src/services/legal-search.service';

describe('LegalSearchService Unit Tests', () => {
  let service: LegalSearchService;

  beforeEach(() => {
    service = new LegalSearchService();
  });

  describe('Language Detection', () => {
    it('should detect Uzbek Latin', () => {
      expect(service.detectLanguage('Merosni qabul qilib olish muddati qancha?')).toBe('UZ_LATIN');
      expect(service.detectLanguage('Avtomobil oldi-sotdisida davlat boji qancha?')).toBe('UZ_LATIN');
    });

    it('should detect Uzbek Cyrillic', () => {
      expect(service.detectLanguage('Мерос гувоҳномасини олиш тартиби қандай?')).toBe('UZ_CYRILLIC');
      expect(service.detectLanguage('Ишончнома муддати қанча бўлади?')).toBe('UZ_CYRILLIC');
    });

    it('should detect Russian', () => {
      expect(service.detectLanguage('Как оформить доверенность на управление автомобилем?')).toBe('RU');
      expect(service.detectLanguage('Какая госпошлина за свидетельство о наследстве?')).toBe('RU');
    });
  });

  describe('Grounding & No-Hallucination Answering', () => {
    it('should provide verified grounded answer for Meros in Uzbek Latin', async () => {
      const response = await service.answerQuestion('Meros ochish va qabul qilish muddati', 'UZ_LATIN');

      expect(response.hasVerifiedNorm).toBe(true);
      expect(response.language).toBe('UZ_LATIN');
      expect(response.sourceUrl).toContain('https://lex.uz');
      expect(response.legalBasis).toContain('Fuqarolik kodeksi');
      expect(response.verifiedDate).toBe('2026-01-01');
      expect(response.fullFormattedText).toContain('Huquqiy asos:');
      expect(response.fullFormattedText).toContain('Rasmiy manba (Lex.uz):');
      expect(response.fullFormattedText).toContain('Huquqiy eslatma:');
    });

    it('should provide verified grounded answer in Uzbek Cyrillic', async () => {
      const response = await service.answerQuestion('Автомобиль олди-сотдиси давлат божи', 'UZ_CYRILLIC');

      expect(response.hasVerifiedNorm).toBe(true);
      expect(response.language).toBe('UZ_CYRILLIC');
      expect(response.fullFormattedText).toContain('Ҳуқуқий асос:');
      expect(response.fullFormattedText).toContain('Ҳуқуқий эслатма:');
    });

    it('should provide verified grounded answer in Russian', async () => {
      const response = await service.answerQuestion('Какой максимальный срок действия доверенности?', 'RU');

      expect(response.hasVerifiedNorm).toBe(true);
      expect(response.language).toBe('RU');
      expect(response.fullFormattedText).toContain('Правовое основание:');
      expect(response.fullFormattedText).toContain('Правовая оговорка:');
    });

    it('should gracefully handle queries with no verified norm without hallucination', async () => {
      const query = 'Qamchiq dovonida ob-havo qanday va samolyot qachon uchadi?';
      const response = await service.answerQuestion(query, 'UZ_LATIN');

      expect(response.hasVerifiedNorm).toBe(false);
      expect(response.fullFormattedText).toContain('tasdiqlangan huquqiy norma topilmadi');
      expect(response.officialFallbackUrl).toContain('https://lex.uz/search/natsearch');
    });
  });
});
