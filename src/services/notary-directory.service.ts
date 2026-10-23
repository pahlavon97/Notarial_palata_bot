import {
  ENotariusProvider,
  eNotariusProvider,
  VerifiedNotary,
  ENotariusRegionInfo,
  ENotariusDistrictInfo,
  NotarySearchResult,
} from '../providers/e-notarius.provider';
import { OFFICIAL_URLS } from '../config/constants';
import { SupportedLanguage } from './legal-search.service';

export class NotaryDirectoryService {
  constructor(private provider: ENotariusProvider = eNotariusProvider) {}

  public getRegions(): ENotariusRegionInfo[] {
    return this.provider.getRegions();
  }

  public getRegionById(regionIdentifier: number | string): ENotariusRegionInfo | undefined {
    return this.provider.getRegionById(regionIdentifier);
  }

  public async getDistrictsByRegion(regionIdentifier: number | string): Promise<ENotariusDistrictInfo[]> {
    return this.provider.getDistrictsByRegion(regionIdentifier);
  }

  public async searchNotariesByDistrict(
    regionIdentifier: number | string,
    districtIdentifier: number | string,
    page = 1,
    limit = 3
  ): Promise<NotarySearchResult> {
    return this.provider.searchNotariesByDistrict(regionIdentifier, districtIdentifier, page, limit);
  }

  public async getNotariesByRegion(regionId: string): Promise<VerifiedNotary[]> {
    return this.provider.getNotariesByRegion(regionId);
  }

  public async searchNotaries(regionId: string, district?: string): Promise<VerifiedNotary[]> {
    return this.provider.findNotaries(regionId, district);
  }

  public formatNotaryCard(notary: VerifiedNotary, lang: SupportedLanguage): string {
    const officeLine = notary.officeName ? `🏢 *Idora:* ${notary.officeName}\n` : '';
    const officeLineCyr = notary.officeName ? `🏢 *Идора:* ${notary.officeName}\n` : '';
    const officeLineRu = notary.officeName ? `🏢 *Контора:* ${notary.officeName}\n` : '';

    if (lang === 'UZ_LATIN') {
      return (
        `🏛 *Notarius:* ${notary.fullName}\n` +
        officeLine +
        `📍 *Manzil:* ${notary.address}\n` +
        `📞 *Telefon:* ${notary.phone}\n` +
        `🕒 *Ish vaqti:* ${notary.workingHours}\n` +
        `🆔 *Litsenziya:* ${notary.licenseNumber}\n` +
        `🌐 *Rasmiy portal:* [E-Notarius orqali navbatga yozilish](${notary.officialUrl})\n` +
        `🗓 *Tekshirilgan sana:* ${notary.verifiedAt}`
      );
    } else if (lang === 'UZ_CYRILLIC') {
      return (
        `🏛 *Нотариус:* ${notary.fullName}\n` +
        officeLineCyr +
        `📍 *Манзил:* ${notary.address}\n` +
        `📞 *Телефон:* ${notary.phone}\n` +
        `🕒 *Иш вақти:* ${notary.workingHours}\n` +
        `🆔 *Лицензия:* ${notary.licenseNumber}\n` +
        `🌐 *Расмий портал:* [E-Notarius орқали навбатга ёзилиш](${notary.officialUrl})\n` +
        `🗓 *Текширилган сана:* ${notary.verifiedAt}`
      );
    } else {
      return (
        `🏛 *Нотариус:* ${notary.fullName}\n` +
        officeLineRu +
        `📍 *Адрес:* ${notary.address}\n` +
        `📞 *Телефон:* ${notary.phone}\n` +
        `🕒 *Режим работы:* ${notary.workingHours}\n` +
        `🆔 *Лицензия:* ${notary.licenseNumber}\n` +
        `🌐 *Официальный портал:* [Электронная запись на E-Notarius](${notary.officialUrl})\n` +
        `🗓 *Дата проверки:* ${notary.verifiedAt}`
      );
    }
  }

  public formatNotariesPage(result: NotarySearchResult, lang: SupportedLanguage): string {
    const { regionName, districtName, total, page, totalPages, notaries, isDegraded } = result;

    let header = '';
    if (lang === 'UZ_LATIN') {
      header = `📍 *${regionName}, ${districtName}*\n🔍 *Rasmiy notariuslar ro‘yxati* (Jami: ${total} ta, Sahifa: ${page}/${totalPages || 1}):\n\n`;
      if (isDegraded) {
        header += `⚠️ _E-Notarius tizimiga ulanish cheklanganligi sababli lokal reestrdan ma’lumot taqdim etilmoqda._\n\n`;
      }
    } else if (lang === 'UZ_CYRILLIC') {
      header = `📍 *${regionName}, ${districtName}*\n🔍 *Расмий нотариуслар рўйхати* (Жами: ${total} та, Саҳифа: ${page}/${totalPages || 1}):\n\n`;
      if (isDegraded) {
        header += `⚠️ _E-Notarius тизимига уланиш чекланганлиги сабабли локал реестрдан маълумот тақдим этилмоқда._\n\n`;
      }
    } else {
      header = `📍 *${regionName}, ${districtName}*\n🔍 *Список официальных нотариусов* (Всего: ${total}, Страница: ${page}/${totalPages || 1}):\n\n`;
      if (isDegraded) {
        header += `⚠️ _В связи с временной недоступностью внешней системы данные предоставлены из локального реестра._\n\n`;
      }
    }

    const cards = notaries.map((n, i) => `${i + 1}. ` + this.formatNotaryCard(n, lang)).join('\n\n───────────────\n\n');
    return header + cards;
  }

  public getPortalLinkText(lang: SupportedLanguage): string {
    if (lang === 'UZ_LATIN') {
      return `🏛 *Barcha hududlar va to‘liq reestr:* [E-Notarius.uz rasmiy qidiruv portali](${OFFICIAL_URLS.E_NOTARIUS_FIND_NOTARY})`;
    } else if (lang === 'UZ_CYRILLIC') {
      return `🏛 *Барча ҳудудлар ва тўлиқ реестр:* [E-Notarius.uz расмий қидирув портали](${OFFICIAL_URLS.E_NOTARIUS_FIND_NOTARY})`;
    } else {
      return `🏛 *Все регионы и единый реестр:* [Официальный портал поиска E-Notarius.uz](${OFFICIAL_URLS.E_NOTARIUS_FIND_NOTARY})`;
    }
  }
}

export const notaryDirectoryService = new NotaryDirectoryService();
