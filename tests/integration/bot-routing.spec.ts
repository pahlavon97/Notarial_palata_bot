import { QuestionHandler } from '../../src/bot/handlers/question.handler';
import { userService } from '../../src/services/user.service';
import { notaryDirectoryService } from '../../src/services/notary-directory.service';

describe('Bot Routing & Logic Integration Tests', () => {
  const mockUserId = 12345678;

  beforeEach(async () => {
    await userService.getOrCreateUser(mockUserId, { firstName: 'Sardor' });
    await userService.setLanguage(mockUserId, 'UZ_LATIN');
  });

  it('MUST NOT forward inquiries to human operators or ticketing queues', async () => {
    let repliedText = '';

    const mockCtx: any = {
      from: { id: mockUserId },
      replyWithMarkdown: jest.fn().mockImplementation((text: string) => {
        repliedText = text;
        return Promise.resolve();
      }),
      reply: jest.fn(),
      sendChatAction: jest.fn().mockResolvedValue(true),
    };

    // User attempts to dispatch a complaint / contact an operator
    await QuestionHandler.handleIncomingText(mockCtx, 'Meni operatorga ulang, shikoyat yubormoqchiman');

    expect(mockCtx.replyWithMarkdown).toHaveBeenCalledTimes(1);
    expect(repliedText).toContain('operatorlarga yuborish, ijro nazoratiga olish funksiyasi mavjud emas');
    expect(repliedText).toContain('(71) 203-05-55');
  });

  it('should format verified notary cards with all mandatory fields', async () => {
    const notaries = await notaryDirectoryService.getNotariesByRegion('tashkent_city');
    expect(notaries.length).toBeGreaterThan(0);

    const card = notaryDirectoryService.formatNotaryCard(notaries[0]!, 'UZ_LATIN');
    expect(card).toContain('Notarius:');
    expect(card).toContain('Litsenziya:');
    expect(card).toContain('Manzil:');
    expect(card).toContain('Telefon:');
    expect(card).toContain('Ish vaqti:');
    expect(card).toContain('E-Notarius orqali navbatga yozilish');
    expect(card).toContain('Tekshirilgan sana:');
  });

  it('should switch user language correctly', async () => {
    await userService.setLanguage(mockUserId, 'RU');
    const lang = await userService.getLanguage(mockUserId);
    expect(lang).toBe('RU');

    await userService.setLanguage(mockUserId, 'UZ_CYRILLIC');
    const cyrLang = await userService.getLanguage(mockUserId);
    expect(cyrLang).toBe('UZ_CYRILLIC');
  });
});
