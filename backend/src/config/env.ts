import dotenv from "dotenv";

// Doğru path ile env dosyasını yükle
dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});

interface Config {
    // Server ayarları
    PORT: number;
    NODE_ENV: string;
    
    // Database ayarları
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_URL?: string;

    DOMAIN: string;
    // Session ayarları
    SESSION_SECRET: string;
    
    // API Key ayarları
    SUPER_ADMIN_API_KEY: string;
    
    // Log ayarları
    LOG_LEVEL: string;
}

export const Enum: Config = {
    // Server ayarları
    PORT: parseInt(process.env.PORT || "3001"),
    NODE_ENV: process.env.NODE_ENV || "development",
    
    // Database ayarları
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "5432"),
    DB_NAME: process.env.DB_NAME || "kuafor_db",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "password",
    DB_URL: process.env.DB_URL,
    
    // Session ayarları
    SESSION_SECRET: process.env.SESSION_SECRET || "your-super-secret-session-key-change-in-production",
    
    // API Key ayarları
    SUPER_ADMIN_API_KEY: process.env.SUPER_ADMIN_API_KEY || "your-super-secret-api-key-change-in-production",
    
    DOMAIN: process.env.DOMAIN || "localhost",
    
    // Log ayarları
    LOG_LEVEL: process.env.LOG_LEVEL || "info"
};

// Development ortamında eksik env değişkenlerini kontrol et
if (Enum.NODE_ENV === "development") {
    const requiredEnvVars = [
        'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
        console.warn('⚠️  Eksik environment değişkenleri:', missingEnvVars.join(', '));
        console.warn('💡 .env.development dosyasını kontrol edin');
    }
}

export default Enum;