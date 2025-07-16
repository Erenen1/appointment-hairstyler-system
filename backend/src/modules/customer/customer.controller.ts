import { NextFunction, Request, Response } from "express";
import CustomerService from "./customer.service";
import { ApiSuccess } from "../../utils/ApiResponse";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./dto";

/**
 * Müşteri işlemleri için controller sınıfı
 */
class CustomerController {
    private customerService: CustomerService;

    constructor(customerService: CustomerService) {
        this.customerService = customerService;
    }

    /**
     * Tüm müşterileri getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getAllCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json(ApiSuccess.list(customers, undefined, 'Müşteriler başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID'ye göre müşteri getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const customer = await this.customerService.getCustomerById(id);
            res.status(200).json(ApiSuccess.item(customer, 'Müşteri başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yeni müşteri oluşturur
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerDto: CustomerCreateDTO = req.body;
            const newCustomer = await this.customerService.createCustomer(customerDto);
            res.status(201).json(ApiSuccess.created(newCustomer, 'Müşteri başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Müşteri bilgilerini günceller
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const customerDto: CustomerUpdateDTO = req.body;
            const updatedCustomer = await this.customerService.updateCustomer(id, customerDto);
            res.status(200).json(ApiSuccess.updated(updatedCustomer, 'Müşteri başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Müşteri kaydını siler
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            await this.customerService.deleteCustomer(id);
            res.status(200).json(ApiSuccess.deleted('Müşteri başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }
}

export default CustomerController; 