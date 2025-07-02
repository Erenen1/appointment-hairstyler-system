import { createHash, randomBytes } from 'crypto';
export class HashUtils {
  static sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
  static sha256WithSalt(data: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || this.generateSalt();
    const hash = this.sha256(data + generatedSalt);
    return {
      hash,
      salt: generatedSalt
    };
  }
  static hashPassword(password: string): string {
    const salt = this.generateSalt();
    const hash = this.sha256(password + salt);
    return `${salt}:${hash}`;
  }
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
  static generateSalt(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
  static generateToken(length: number = 64): string {
    return randomBytes(length).toString('hex');
  }
  static md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }
  static hmacSha256(data: string, secret: string): string {
    return createHash('sha256').update(data + secret).digest('hex');
  }
} 