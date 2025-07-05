"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUtils = void 0;
const crypto_1 = require("crypto");
class HashUtils {
    static sha256(data) {
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    static sha256WithSalt(data, salt) {
        const generatedSalt = salt || this.generateSalt();
        const hash = this.sha256(data + generatedSalt);
        return {
            hash,
            salt: generatedSalt
        };
    }
    static hashPassword(password) {
        const salt = this.generateSalt();
        const hash = this.sha256(password + salt);
        return `${salt}:${hash}`;
    }
    static verifyPassword(password, hashedPassword) {
        try {
            const [salt, hash] = hashedPassword.split(':');
            if (!salt || !hash) {
                return false;
            }
            const newHash = this.sha256(password + salt);
            return hash === newHash;
        }
        catch (error) {
            return false;
        }
    }
    static generateSalt(length = 32) {
        return (0, crypto_1.randomBytes)(length).toString('hex');
    }
    static generateToken(length = 64) {
        return (0, crypto_1.randomBytes)(length).toString('hex');
    }
    static md5(data) {
        return (0, crypto_1.createHash)('md5').update(data).digest('hex');
    }
    static hmacSha256(data, secret) {
        return (0, crypto_1.createHash)('sha256').update(data + secret).digest('hex');
    }
}
exports.HashUtils = HashUtils;
//# sourceMappingURL=hashUtils.js.map