import { CommandHandler } from '../../src/bot/handlers/command.handler';
import { MenuHandler } from '../../src/bot/handlers/menu.handler';
import { NotaryHandler } from '../../src/bot/handlers/notary.handler';
import { Keyboards } from '../../src/bot/keyboards';
import { userService } from '../../src/services/user.service';

describe('Bot Handlers & Keyboards Unit Tests', () => {
  const userId = 888777;

  beforeEach(async () => {
    await userService.getOrCreateUser(userId, { firstName: 'Ali', username: 'ali_dev' });
    await userService.setLanguage(userId, 'UZ_LATIN');
  });

  describe('Keyboards', () => {
    it('should generate main menu for each language with correct buttons', () => {
      const menuLat = Keyboards.getMainMenu('UZ_LATIN');
      expect(menuLat.reply_markup.keyboard.length).toBe(5);

      const menuCyr = Keyboards.getMainMenu('UZ_CYRILLIC');
      expect(menuCyr.reply_markup.keyboard.length).toBe(5);

      const menuRu = Keyboards.getMainMenu('RU');
      expect(menuRu.reply_markup.keyboard.length).toBe(5);
    });

    it('should generate language picker inline keyboard', () => {
      const picker = Keyboards.getLanguagePicker();
      expect(picker.reply_markup.inline_keyboard.length).toBe(3);
    });

    it('should generate regions inline keyboard in chunks', () => {
      const regionsLat = Keyboards.getRegionsKeyboard('UZ_LATIN');
      expect(regionsLat.reply_markup.inline_keyboard.length).toBeGreaterThan(5);

      const regionsRu = Keyboards.getRegionsKeyboard('RU');
      expect(regionsRu.reply_markup.inline_keyboard.length).toBeGreaterThan(5);
    });

    it('should generate notary action url keyboard', () => {
      const actionKb = Keyboards.getNotaryActionKeyboard('https://e-notarius.uz/', 'UZ_LATIN');
      expect(actionKb.reply_markup.inline_keyboard[0]![0]!.text).toContain('E-Notarius');
    });
  });

  describe('CommandHandler', () => {
    it('should handle /start command with user greeting and menu', async () => {
      const mockCtx: any = {
        from: { id: userId, first_name: 'Ali' },
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await CommandHandler.handleStart(mockCtx);
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Ali'),
        expect.anything()
      );
    });

    it('should handle /help command', async () => {
      const mockCtx: any = {
        from: { id: userId },
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await CommandHandler.handleHelp(mockCtx);
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Botdan foydalanish'),
        expect.anything()
      );
    });

    it('should handle /about command', async () => {
      const mockCtx: any = {
        from: { id: userId },
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await CommandHandler.handleAbout(mockCtx);
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Notarial palatasi haqida'),
        expect.anything()
      );
    });

    it('should handle /lang command to show language options', async () => {
      const mockCtx: any = {
        from: { id: userId },
        reply: jest.fn().mockResolvedValue(true),
      };

      await CommandHandler.handleLanguage(mockCtx);
      expect(mockCtx.reply).toHaveBeenCalledWith(
        expect.stringContaining('tilini tanlang'),
        expect.anything()
      );
    });
  });

  describe('MenuHandler', () => {
    it('should prompt user to ask question when button clicked', async () => {
      const mockCtx: any = {
        from: { id: userId },
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await MenuHandler.handleAskQuestionPrompt(mockCtx);
      expect(await userService.isWaitingForQuestion(userId)).toBe(true);
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Huquqiy savolingizni yozing')
      );
    });

    it('should handle language change callback', async () => {
      const mockCtx: any = {
        from: { id: userId },
        answerCbQuery: jest.fn().mockResolvedValue(true),
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await MenuHandler.handleLanguageChangeCallback(mockCtx, 'RU');
      expect(await userService.getLanguage(userId)).toBe('RU');
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Русский'),
        expect.anything()
      );
    });
  });

  describe('NotaryHandler', () => {
    it('should open regions menu on notary search button', async () => {
      const mockCtx: any = {
        from: { id: userId },
        reply: jest.fn().mockResolvedValue(true),
      };

      await NotaryHandler.handleNotarySearchMenu(mockCtx);
      expect(mockCtx.reply).toHaveBeenCalledWith(
        expect.stringContaining('hududni'),
        expect.anything()
      );
    });

    it('should display districts keyboard when region is selected', async () => {
      const mockCtx: any = {
        from: { id: userId },
        answerCbQuery: jest.fn().mockResolvedValue(true),
        sendChatAction: jest.fn().mockResolvedValue(true),
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await NotaryHandler.handleRegionSelect(mockCtx, 'tashkent_city');
      expect(mockCtx.answerCbQuery).toHaveBeenCalled();
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Toshkent shahri'),
        expect.anything()
      );
    });

    it('should search and display notaries when district is selected', async () => {
      const mockCtx: any = {
        from: { id: userId },
        answerCbQuery: jest.fn().mockResolvedValue(true),
        sendChatAction: jest.fn().mockResolvedValue(true),
        replyWithMarkdown: jest.fn().mockResolvedValue(true),
      };

      await NotaryHandler.handleDistrictSelect(mockCtx, '10', '1004', '1');
      expect(mockCtx.answerCbQuery).toHaveBeenCalled();
      expect(mockCtx.replyWithMarkdown).toHaveBeenCalledWith(
        expect.stringContaining('Yashnobod tumani'),
        expect.anything()
      );
    });
  });
});
