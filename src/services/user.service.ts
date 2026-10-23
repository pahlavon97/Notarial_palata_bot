import { SupportedLanguage } from './legal-search.service';

export interface UserSessionData {
  telegramId: number;
  language: SupportedLanguage;
  username?: string;
  firstName?: string;
  lastActive: Date;
  selectedRegionId?: string;
  waitingForQuestion?: boolean;
}

export class UserService {
  private inMemoryUsers: Map<number, UserSessionData> = new Map();

  public async getOrCreateUser(telegramId: number, details?: { username?: string; firstName?: string }): Promise<UserSessionData> {
    const existing = this.inMemoryUsers.get(telegramId);
    if (existing) {
      existing.lastActive = new Date();
      if (details?.username) existing.username = details.username;
      if (details?.firstName) existing.firstName = details.firstName;
      return existing;
    }

    const newUser: UserSessionData = {
      telegramId,
      language: 'UZ_LATIN', // default
      username: details?.username,
      firstName: details?.firstName,
      lastActive: new Date(),
    };

    this.inMemoryUsers.set(telegramId, newUser);
    return newUser;
  }

  public async setLanguage(telegramId: number, language: SupportedLanguage): Promise<void> {
    const user = await this.getOrCreateUser(telegramId);
    user.language = language;
    this.inMemoryUsers.set(telegramId, user);
  }

  public async getLanguage(telegramId: number): Promise<SupportedLanguage> {
    const user = await this.getOrCreateUser(telegramId);
    return user.language;
  }

  public async setWaitingForQuestion(telegramId: number, waiting: boolean): Promise<void> {
    const user = await this.getOrCreateUser(telegramId);
    user.waitingForQuestion = waiting;
  }

  public async isWaitingForQuestion(telegramId: number): Promise<boolean> {
    const user = await this.getOrCreateUser(telegramId);
    return Boolean(user.waitingForQuestion);
  }

  public async setSelectedRegion(telegramId: number, regionId: string): Promise<void> {
    const user = await this.getOrCreateUser(telegramId);
    user.selectedRegionId = regionId;
  }

  public async getSelectedRegion(telegramId: number): Promise<string | undefined> {
    const user = await this.getOrCreateUser(telegramId);
    return user.selectedRegionId;
  }

  public getUserCount(): number {
    return this.inMemoryUsers.size;
  }
}

export const userService = new UserService();
