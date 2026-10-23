import { SsrfGuard } from '../../src/security/ssrf-guard';
import { SecurityViolationError } from '../../src/core/errors/app-error';

describe('SsrfGuard Unit Tests', () => {
  it('should accept valid HTTPS URLs from official whitelist', () => {
    const valid1 = SsrfGuard.validateUrl('https://lex.uz/docs/111189');
    expect(valid1.hostname).toBe('lex.uz');

    const valid2 = SsrfGuard.validateUrl('https://advice.uz/uz/category/701');
    expect(valid2.hostname).toBe('advice.uz');

    const valid3 = SsrfGuard.validateUrl('https://e-notarius.uz/');
    expect(valid3.hostname).toBe('e-notarius.uz');
  });

  it('should block non-HTTPS protocols (http, ftp, file)', () => {
    expect(() => SsrfGuard.validateUrl('http://lex.uz/docs/111189')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('ftp://advice.uz')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('file:///etc/passwd')).toThrow(SecurityViolationError);
  });

  it('should block access to internal / private network IPs', () => {
    expect(() => SsrfGuard.validateUrl('https://127.0.0.1:8080')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('https://localhost:3000')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('https://192.168.1.1')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('https://10.0.0.1')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('https://169.254.169.254/latest/meta-data')).toThrow(SecurityViolationError);
  });

  it('should block unauthorized external domains', () => {
    expect(() => SsrfGuard.validateUrl('https://google.com')).toThrow(SecurityViolationError);
    expect(() => SsrfGuard.validateUrl('https://attacker.evil.com/webhook')).toThrow(SecurityViolationError);
  });

  it('should return boolean correctly via isSafeUrl', () => {
    expect(SsrfGuard.isSafeUrl('https://lex.uz/search')).toBe(true);
    expect(SsrfGuard.isSafeUrl('http://malicious.org')).toBe(false);
  });
});
