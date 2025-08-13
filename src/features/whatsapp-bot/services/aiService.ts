import { Property } from '../../properties/types';

export interface AIResponse {
    message: string;
    confidence: number;
    suggestions?: string[];
    relatedProperties?: Property[];
}

export interface AIContext {
    userMessage: string;
    userPreferences?: {
        budget?: number;
        location?: string;
        propertyType?: string;
        rooms?: string;
    };
    conversationHistory: Array<{
        role: 'user' | 'assistant';
        message: string;
        timestamp: string;
    }>;
}

export class AIService {
    private properties: Property[] = [];
    private knowledgeBase: Map<string, any> = new Map();

    constructor(properties: Property[]) {
        this.properties = properties;
        this.buildKnowledgeBase();
    }

    private buildKnowledgeBase() {
        // İlan verilerinden bilgi tabanı oluştur
        this.knowledgeBase.set('propertyTypes', this.getUniqueValues('type'));
        this.knowledgeBase.set('categories', this.getUniqueValues('category'));
        this.knowledgeBase.set('districts', this.getUniqueValues('address.district'));
        this.knowledgeBase.set('priceRanges', this.getPriceRanges());
        this.knowledgeBase.set('areaRanges', this.getAreaRanges());
        this.knowledgeBase.set('features', this.getAllFeatures());
    }

    private getUniqueValues(field: string): string[] {
        const values = new Set<string>();
        this.properties.forEach(property => {
            const value = this.getNestedValue(property, field);
            if (value) values.add(value);
        });
        return Array.from(values);
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    private getPriceRanges() {
        const prices = this.properties.map(p => p.price).filter(p => p > 0);
        if (prices.length === 0) return [];

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

        return [
            { label: 'Ekonomik', min: 0, max: avg * 0.6 },
            { label: 'Orta Segment', min: avg * 0.6, max: avg * 1.4 },
            { label: 'Lüks', min: avg * 1.4, max: max }
        ];
    }

    private getAreaRanges() {
        const areas = this.properties.map(p => p.area).filter(a => a > 0);
        if (areas.length === 0) return [];

        const min = Math.min(...areas);
        const max = Math.max(...areas);
        const avg = areas.reduce((a, b) => a + b, 0) / areas.length;

        return [
            { label: 'Küçük', min: 0, max: avg * 0.7 },
            { label: 'Orta', min: avg * 0.7, max: avg * 1.3 },
            { label: 'Büyük', min: avg * 1.3, max: max }
        ];
    }

    private getAllFeatures(): string[] {
        const features = new Set<string>();
        this.properties.forEach(property => {
            property.features?.forEach(feature => features.add(feature));
        });
        return Array.from(features);
    }

    public async generateResponse(context: AIContext): Promise<AIResponse> {
        const { userMessage, userPreferences, conversationHistory } = context;

        // Kullanıcı mesajını analiz et
        const intent = this.analyzeIntent(userMessage);
        const entities = this.extractEntities(userMessage);

        // Uygun ilanları bul
        const relevantProperties = this.findRelevantProperties(intent, entities, userPreferences);

        // AI yanıtını oluştur
        const response = await this.createResponse(intent, entities, relevantProperties, conversationHistory);

        return response;
    }

    private analyzeIntent(message: string): string {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('satılık') || lowerMessage.includes('kiralık')) {
            return 'property_search';
        }

        if (lowerMessage.includes('fiyat') || lowerMessage.includes('ne kadar')) {
            return 'price_inquiry';
        }

        if (lowerMessage.includes('nerede') || lowerMessage.includes('konum') || lowerMessage.includes('adres')) {
            return 'location_inquiry';
        }

        if (lowerMessage.includes('özellik') || lowerMessage.includes('detay')) {
            return 'property_details';
        }

        if (lowerMessage.includes('yardım') || lowerMessage.includes('nasıl')) {
            return 'help_request';
        }

        return 'general_inquiry';
    }

    private extractEntities(message: string): any {
        const entities: any = {};
        const lowerMessage = message.toLowerCase();

        // İlan türü
        if (lowerMessage.includes('satılık')) entities.type = 'Satılık';
        if (lowerMessage.includes('kiralık')) entities.type = 'Kiralık';

        // Kategori
        const categories = ['daire', 'müstakil', 'villa', 'ofis', 'dükkan', 'arsa'];
        categories.forEach(cat => {
            if (lowerMessage.includes(cat)) entities.category = cat.charAt(0).toUpperCase() + cat.slice(1);
        });

        // Oda sayısı
        const roomMatch = lowerMessage.match(/(\d+)\+(\d+)/);
        if (roomMatch) {
            entities.rooms = `${roomMatch[1]}+${roomMatch[2]}`;
        }

        // İlçe
        const districts = this.knowledgeBase.get('districts') || [];
        districts.forEach((district: string) => {
            if (lowerMessage.includes(district.toLowerCase())) {
                entities.district = district;
            }
        });

        // Fiyat aralığı
        const priceMatch = lowerMessage.match(/(\d+)\s*(?:bin|milyon|milyar)?\s*(?:tl|₺)/i);
        if (priceMatch) {
            entities.price = parseInt(priceMatch[1]);
        }

        return entities;
    }

    private findRelevantProperties(intent: string, entities: any, preferences?: any): Property[] {
        let filtered = [...this.properties];

        // İlan türüne göre filtrele
        if (entities.type) {
            filtered = filtered.filter(p => p.type === entities.type);
        }

        // Kategoriye göre filtrele
        if (entities.category) {
            filtered = filtered.filter(p => p.category === entities.category);
        }

        // Oda sayısına göre filtrele
        if (entities.rooms) {
            filtered = filtered.filter(p => p.rooms === entities.rooms);
        }

        // İlçeye göre filtrele
        if (entities.district) {
            filtered = filtered.filter(p => p.address.district === entities.district);
        }

        // Fiyata göre filtrele
        if (entities.price) {
            filtered = filtered.filter(p => p.price <= entities.price * 1.2); // %20 tolerans
        }

        // Kullanıcı tercihlerine göre filtrele
        if (preferences) {
            if (preferences.budget) {
                filtered = filtered.filter(p => p.price <= preferences.budget);
            }
            if (preferences.location) {
                filtered = filtered.filter(p =>
                    p.address.district.toLowerCase().includes(preferences.location.toLowerCase()) ||
                    p.address.fullAddress.toLowerCase().includes(preferences.location.toLowerCase())
                );
            }
        }

        // En uygun 5 ilanı döndür
        return filtered
            .sort((a, b) => (b.views + b.clicks) - (a.views + a.clicks))
            .slice(0, 5);
    }

    private async createResponse(
        intent: string,
        entities: any,
        properties: Property[],
        history: any[]
    ): Promise<AIResponse> {
        let message = '';
        let suggestions: string[] = [];

        switch (intent) {
            case 'property_search':
                if (properties.length > 0) {
                    message = `Aradığınız kriterlere uygun ${properties.length} ilan buldum:\n\n`;
                    properties.forEach((prop, index) => {
                        message += `${index + 1}. ${prop.title}\n`;
                        message += `   ${prop.type} - ${prop.category}\n`;
                        message += `   ${prop.area}m² - ${prop.rooms}\n`;
                        message += `   ${prop.address.district}\n`;
                        message += `   ${prop.price.toLocaleString()}₺\n\n`;
                    });

                    suggestions = [
                        'Detaylı bilgi almak istiyorum',
                        'Benzer ilanlar var mı?',
                        'Fiyat aralığını değiştir'
                    ];
                } else {
                    message = 'Aradığınız kriterlere uygun ilan bulamadım. Farklı arama kriterleri deneyebilir misiniz?';
                    suggestions = [
                        'Fiyat aralığını genişlet',
                        'Farklı ilçe seç',
                        'Kategoriyi değiştir'
                    ];
                }
                break;

            case 'price_inquiry':
                if (properties.length > 0) {
                    const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
                    message = `Bu bölgedeki ${properties[0].category} ilanlarının ortalama fiyatı ${avgPrice.toLocaleString()}₺ civarında. `;
                    message += `En düşük ${Math.min(...properties.map(p => p.price)).toLocaleString()}₺, `;
                    message += `en yüksek ${Math.max(...properties.map(p => p.price)).toLocaleString()}₺ arasında değişiyor.`;
                } else {
                    message = 'Fiyat bilgisi için önce arama kriterlerinizi belirtmeniz gerekiyor.';
                }
                break;

            case 'location_inquiry':
                if (entities.district) {
                    const districtProperties = this.properties.filter(p => p.address.district === entities.district);
                    message = `${entities.district} bölgesinde ${districtProperties.length} aktif ilan bulunuyor. `;
                    message += `Bu bölge popüler ve ulaşım açısından avantajlı.`;
                } else {
                    message = 'Hangi bölge hakkında bilgi almak istiyorsunuz?';
                }
                break;

            case 'property_details':
                if (properties.length > 0) {
                    const prop = properties[0];
                    message = `${prop.title} hakkında detaylı bilgi:\n\n`;
                    message += `• ${prop.bedrooms} yatak odası, ${prop.bathrooms} banyo\n`;
                    message += `• ${prop.floor}. katta, toplam ${prop.totalFloors} katlı bina\n`;
                    message += `• ${prop.age} yaşında, ${prop.heating} ısıtma\n`;
                    message += `• ${prop.furnished ? 'Eşyalı' : 'Eşyasız'}\n`;
                    message += `• ${prop.parking ? 'Otopark mevcut' : 'Otopark yok'}\n`;
                    message += `• ${prop.balcony ? 'Balkon mevcut' : 'Balkon yok'}\n`;
                    message += `• ${prop.elevator ? 'Asansör mevcut' : 'Asansör yok'}\n\n`;
                    message += `Özellikler: ${prop.features.join(', ')}`;
                }
                break;

            case 'help_request':
                message = 'Size nasıl yardımcı olabilirim?\n\n';
                message += '• İlan arama: "3+1 satılık daire arıyorum"\n';
                message += '• Fiyat bilgisi: "Bu bölgede fiyatlar nasıl?"\n';
                message += '• Konum bilgisi: "Kadıköy bölgesi nasıl?"\n';
                message += '• Detay bilgi: "Bu ilan hakkında detay ver"';
                break;

            default:
                message = 'Merhaba! Emlak ilanları hakkında size nasıl yardımcı olabilirim?';
                suggestions = [
                    'İlan aramak istiyorum',
                    'Fiyat bilgisi almak istiyorum',
                    'Bölge hakkında bilgi almak istiyorum'
                ];
        }

        return {
            message,
            confidence: 0.85,
            suggestions,
            relatedProperties: properties
        };
    }

    public updateProperties(newProperties: Property[]) {
        this.properties = newProperties;
        this.buildKnowledgeBase();
    }

    public getKnowledgeBase() {
        return this.knowledgeBase;
    }
}

export default AIService;
