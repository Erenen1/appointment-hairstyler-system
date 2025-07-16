import { NextFunction, Request, Response } from "express";
import ContactService from "./contact.service";
import { ApiSuccess } from "../../utils/ApiResponse";
import { ContactCreateDTO } from "./dto";

/**
 * İletişim mesajları işlemleri için controller sınıfı
 */
class ContactController {
    private contactService: ContactService;

    constructor(contactService: ContactService) {
        this.contactService = contactService;
    }

    /**
     * Filtreleme ve sayfalama ile iletişim mesajlarını getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getContactMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { rows, pagination } = await this.contactService.getContactMessages(req.query);
            res.status(200).json(ApiSuccess.list(rows, pagination, 'İletişim mesajları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID'ye göre iletişim mesajı getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getContactMessageById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const message = await this.contactService.getContactMessageById(id);
            res.status(200).json(ApiSuccess.item(message, 'İletişim mesajı başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * İletişim mesajını siler
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async deleteContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            await this.contactService.deleteContactMessage(id);
            res.status(200).json(ApiSuccess.deleted('İletişim mesajı başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yeni iletişim mesajı oluşturur
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async createContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const contactDto: ContactCreateDTO = req.body;
            const clientInfo = {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'] || ''
            };
            
            const newMessage = await this.contactService.createContactMessage(contactDto, clientInfo);
            res.status(201).json(ApiSuccess.created(
                newMessage,
                'İletişim mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
            ));
        } catch (error) {
            next(error);
        }
    }

    /**
     * İletişim istatistiklerini getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getContactStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this.contactService.getContactStats();
            res.status(200).json(ApiSuccess.item(stats, 'İletişim istatistikleri başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }
}

export default ContactController; 