import { ALLOWED_EXTERNAL_HOSTS } from '../config/constants';
import { SecurityViolationError } from '../core/errors/app-error';

const PRIVATE_IP_RANGES = [
  /^127\./,                         // Loopback
  /^10\./,                          // Class A private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
  /^192\.168\./,                    // Class C private
  /^169\.254\./,                    // Link-local
  /^::1$/,                          // IPv6 loopback
  /^fc00:/i,                       // IPv6 unique local
  /^fe80:/i,                       // IPv6 link-local
  /^localhost$/i,
];

export class SsrfGuard {
  /**
   * Validate that the URL is strictly HTTPS and targets an approved legal domain
   */
  public static validateUrl(inputUrl: string): URL {
    let parsed: URL;
    try {
      parsed = new URL(inputUrl);
    } catch {
      throw new SecurityViolationError(`Invalid URL format: ${inputUrl}`);
    }

    if (parsed.protocol !== 'https:') {
      throw new SecurityViolationError(`Protocol '${parsed.protocol}' is forbidden. Only 'https:' is permitted.`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against private IP / localhost addresses
    for (const pattern of PRIVATE_IP_RANGES) {
      if (pattern.test(hostname)) {
        throw new SecurityViolationError(`Access to private/local network address '${hostname}' is strictly blocked.`);
      }
    }

    // Must be in allowlist
    const isAllowed = ALLOWED_EXTERNAL_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );

    if (!isAllowed) {
      throw new SecurityViolationError(
        `Host '${hostname}' is not in the official whitelist of authorized legal sources.`
      );
    }

    return parsed;
  }

  /**
   * Safe check boolean version
   */
  public static isSafeUrl(inputUrl: string): boolean {
    try {
      this.validateUrl(inputUrl);
      return true;
    } catch {
      return false;
    }
  }
}
