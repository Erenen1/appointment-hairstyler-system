import { createHash, randomBytes } from 'crypto';

/**
 * Hash işlemleri için utility class
 */
export class HashUtils {
  /**
   * SHA256 hash oluştur
   */
  static sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Salt ile beraber SHA256 hash oluştur
   */
  static sha256WithSalt(data: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || this.generateSalt();
    const hash = this.sha256(data + generatedSalt);
    
    return {
      hash,
      salt: generatedSalt
    };
  }

  /**
   * Şifreyi hash'le ve salt ile birlikte sakla
   */
  static hashPassword(password: string): string {
    const salt = this.generateSalt();
    const hash = this.sha256(password + salt);
    
    // Salt ve hash'i birlikte saklayalım (salt:hash formatında)
    return `${salt}:${hash}`;
  }

  /**
   * Şifreyi doğrula
   */
  static verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':');
      if (!salt || !hash) {
        return false;
      }

      const newHash = this.sha256(password + salt);
      return hash === newHash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Random salt üret
   */
  static generateSalt(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Random token üret
   */
  static generateToken(length: number = 64): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * MD5 hash (gerekirse)
   */
  static md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }

  /**
   * HMAC SHA256
   */
  static hmacSha256(data: string, secret: string): string {
    return createHash('sha256').update(data + secret).digest('hex');
  }
} 