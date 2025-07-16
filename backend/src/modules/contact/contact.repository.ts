import { IContactMessage, IContactStats } from "./contact.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models";
import { Op, fn, col } from "sequelize";

const { ContactMessage } = db;

/**
 * İletişim mesajları veritabanı işlemleri için repository sınıfı
 */
class ContactRepository extends BaseRepository<IContactMessage> {
    constructor() {
        super(ContactMessage);
    }

    /**
     * Filtreleme için where koşullarını oluşturur
     * @param filters Filtre parametreleri
     * @returns Where koşulları nesnesi
     */
    private buildWhereConditions(filters: any) {
        const { search, startDate, endDate } = filters;
        const conditions: any = {};

        if (search) {
            conditions[Op.or] = ['fullName', 'email', 'subject', 'message'].map(field => ({
                [field]: { [Op.like]: `%${search}%` }
            }));
        }

        if (startDate || endDate) {
            conditions.createdAt = {};
            if (startDate) conditions.createdAt[Op.gte] = startDate;
            if (endDate) conditions.createdAt[Op.lte] = endDate;
        }

        return conditions;
    }

    /**
     * Filtreleme ve sayfalama ile iletişim mesajlarını getirir
     * @param page Sayfa numarası
     * @param limit Sayfa başına kayıt sayısı
     * @param sortBy Sıralama alanı
     * @param sortOrder Sıralama yönü
     * @param filters Filtre parametreleri
     * @returns Mesajlar ve sayfalama bilgileri
     */
    public async getContactMessages(page: number, limit: number, sortBy: string, sortOrder: string, filters: any): Promise<{
        rows: IContactMessage[];
        count: number;
    }> {
        const whereConditions = this.buildWhereConditions(filters);
        const offset = (page - 1) * limit;
        const orderBy = [[sortBy === 'name' ? 'fullName' : sortBy, sortOrder.toUpperCase()]];

        return await ContactMessage.findAndCountAll({
            where: whereConditions,
            order: orderBy,
            limit: limit,
            offset: offset,
            attributes: { exclude: ['ipAddress', 'userAgent'] }
        });
    }

    /**
     * ID'ye göre iletişim mesajı arar
     * @param id İletişim mesajı ID
     * @returns Bulunan iletişim mesajı veya null
     */
    public async findById(id: string): Promise<IContactMessage | null> {
        return await this.findOne({ where: { id } });
    }

    /**
     * İletişim mesajını okundu olarak işaretler
     * @param id İletişim mesajı ID
     * @returns Güncellenen iletişim mesajı
     */
    public async markAsRead(id: string): Promise<IContactMessage | null> {
        return await this.update(id, { isRead: true });
    }

    /**
     * İletişim mesajını siler
     * @param id İletişim mesajı ID
     * @returns İşlem başarılı ise true
     */
    public async deleteContactMessage(id: string): Promise<boolean> {
        return await this.delete(id);
    }

    /**
     * Yeni iletişim mesajı oluşturur
     * @param contactMessage İletişim mesajı bilgileri
     * @returns Oluşturulan iletişim mesajı
     */
    public async createContactMessage(contactMessage: IContactMessage): Promise<IContactMessage> {
        return await this.create(contactMessage);
    }

    /**
     * İletişim istatistiklerini getirir
     * @returns İletişim istatistikleri
     */
    public async getContactStats(): Promise<IContactStats> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [totalMessages, unreadMessages, messagesThisMonth, dailyStats] = await Promise.all([
            ContactMessage.count(),
            ContactMessage.count({ where: { isRead: false } }),
            ContactMessage.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
            ContactMessage.findAll({
                attributes: [[fn('DATE', col('createdAt')), 'date'], [fn('COUNT', col('id')), 'count']],
                where: { createdAt: { [Op.gte]: sevenDaysAgo } },
                group: [fn('DATE', col('createdAt'))],
                order: [[fn('DATE', col('createdAt')), 'ASC']],
                raw: true
            })
        ]);

        return {
            summary: {
                totalMessages,
                unreadMessages,
                messagesThisMonth,
                responseRate: totalMessages > 0 ? Math.round(((totalMessages - unreadMessages) / totalMessages) * 100) : 0
            },
            dailyStats
        };
    }
}

export default ContactRepository; 