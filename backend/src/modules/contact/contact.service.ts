import { ApiError } from "../../utils/ApiError";
import ContactRepository from "./contact.repository";
import { ContactCreateDTO, ContactUpdateDTO } from "./dto";
import { IContactMessage, IContactStats } from "./contact.interface";

/**
 * İletişim mesajları işlemleri için servis sınıfı
 */
class ContactService {
    private contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Filtreleme ve sayfalama ile iletişim mesajlarını getirir
     * @param queryParams Sorgu parametreleri
     * @returns Mesajlar ve sayfalama bilgileri
     */
    public async getContactMessages(queryParams: any): Promise<{
        rows: IContactMessage[];
        count: number;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        const page = Number(queryParams.page) || 1;
        const limit = Number(queryParams.limit) || 10;
        const sortBy = queryParams.sortBy || 'createdAt';
        const sortOrder = queryParams.sortOrder || 'desc';
        const filters = {
            search: queryParams.search,
            startDate: queryParams.startDate,
            endDate: queryParams.endDate
        };

        const { rows, count } = await this.contactRepository.getContactMessages(
            page,
            limit,
            sortBy,
            sortOrder,
            filters
        );

        const totalPages = Math.ceil(count / limit);
        const pagination = {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };

        return { rows, count, pagination };
    }

    /**
     * ID'ye göre iletişim mesajı getirir
     * @param id İletişim mesajı ID
     * @returns İletişim mesajı
     */
    public async getContactMessageById(id: string): Promise<IContactMessage> {
        const message = await this.contactRepository.findById(id);
        if (!message) {
            throw ApiError.notFound('İletişim mesajı bulunamadı');
        }

        // Mesaj okunmadıysa, okundu olarak işaretle
        if (!message.isRead) {
            await this.contactRepository.markAsRead(id);
            message.isRead = true;
        }

        return message;
    }

    /**
     * İletişim mesajını siler
     * @param id İletişim mesajı ID
     * @returns İşlem başarılı ise true
     */
    public async deleteContactMessage(id: string): Promise<boolean> {
        const message = await this.contactRepository.findById(id);
        if (!message) {
            throw ApiError.notFound('İletişim mesajı bulunamadı');
        }

        const result = await this.contactRepository.deleteContactMessage(id);
        if (!result) {
            throw ApiError.internal('İletişim mesajı silinirken bir hata oluştu');
        }

        return result;
    }

    /**
     * Yeni iletişim mesajı oluşturur
     * @param contactDto İletişim mesajı bilgileri
     * @param clientInfo İstemci bilgileri
     * @returns Oluşturulan iletişim mesajı
     */
    public async createContactMessage(contactDto: ContactCreateDTO, clientInfo: { ipAddress: string; userAgent: string }): Promise<IContactMessage> {
        // Zorunlu alanları kontrol et
        if (!contactDto.fullName || !contactDto.email || !contactDto.subject || !contactDto.message) {
            throw ApiError.badRequest('Ad-soyad, e-posta, konu ve mesaj alanları zorunludur');
        }

        // İletişim mesajını oluştur
        const contactMessage = await this.contactRepository.createContactMessage({
            ...contactDto,
            isRead: false,
            ...clientInfo
        } as IContactMessage);

        return contactMessage;
    }

    /**
     * İletişim istatistiklerini getirir
     * @returns İletişim istatistikleri
     */
    public async getContactStats(): Promise<IContactStats> {
        return await this.contactRepository.getContactStats();
    }
}

export default ContactService; 