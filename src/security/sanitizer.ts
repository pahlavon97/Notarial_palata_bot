export class Sanitizer {
  private static readonly MAX_QUERY_LENGTH = 1000;

  private static readonly PROMPT_INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
    /you\s+are\s+now\s+(dan|an\s+unfiltered|jailbroken)/i,
    /disregard\s+system\s+prompt/i,
    /reveal\s+your\s+(api\s+key|internal\s+prompt|secret)/i,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /base64\s*,\s*[A-Za-z0-9+/=]+/i,
  ];

  /**
   * Escape special characters for Telegram MarkdownV2
   */
  public static escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
  }

  /**
   * Escape special characters for standard Markdown (classic Telegram Markdown mode)
   */
  public static escapeMarkdown(text: string): string {
    // Escapes unclosed * and _ and ` that could break parse mode
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]');
  }

  /**
   * Escapes HTML entities for Telegram HTML mode
   */
  public static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Sanitize user textual query for legal search
   */
  public static sanitizeQuery(rawInput: string): { clean: string; isSuspicious: boolean; warning?: string } {
    if (!rawInput || typeof rawInput !== 'string') {
      return { clean: '', isSuspicious: false };
    }

    let clean = rawInput.trim();

    // Enforce max length
    if (clean.length > this.MAX_QUERY_LENGTH) {
      clean = clean.substring(0, this.MAX_QUERY_LENGTH);
    }

    // Strip control characters
    clean = clean.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '');

    // Check for prompt injection attempts
    let isSuspicious = false;
    let warning: string | undefined;

    for (const pattern of this.PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(clean)) {
        isSuspicious = true;
        warning = 'Query contained prohibited command override patterns.';
        // Neutralize the injection pattern
        clean = clean.replace(pattern, '[BLOCKED_INSTRUCTION]');
      }
    }

    return { clean, isSuspicious, warning };
  }

  /**
   * Truncate long message into chunks for Telegram limit (4096 characters max per message)
   */
  public static splitTelegramMessage(text: string, maxChunkLength = 3800): string[] {
    if (text.length <= maxChunkLength) {
      return [text];
    }

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxChunkLength) {
        chunks.push(remaining);
        break;
      }

      // Try to break at newline first
      let splitIndex = remaining.lastIndexOf('\n', maxChunkLength);
      if (splitIndex === -1 || splitIndex < maxChunkLength * 0.5) {
        // Fallback to space
        splitIndex = remaining.lastIndexOf(' ', maxChunkLength);
      }
      if (splitIndex === -1 || splitIndex < maxChunkLength * 0.5) {
        // Hard cut
        splitIndex = maxChunkLength;
      }

      chunks.push(remaining.substring(0, splitIndex));
      remaining = remaining.substring(splitIndex).trimStart();
    }

    return chunks;
  }
}
