import { NextFunction, Request, Response } from "express";
import CustomerService from "./customer.service";
import { ApiSuccess, ApiError } from "../../utils";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./dto";


class CustomerController {
    private customerService: CustomerService;

    constructor(customerService: CustomerService) {
        this.customerService = customerService;
    }


    public async getAllCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json(ApiSuccess.list(customers, undefined, 'Müşteriler başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }


    public async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const customer = await this.customerService.getCustomerById(id);
            res.status(200).json(ApiSuccess.item(customer, 'Müşteri başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }


    public async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerDto: CustomerCreateDTO = req.body;
            const newCustomer = await this.customerService.createCustomer(customerDto,req);
            res.status(201).json(ApiSuccess.created(newCustomer, 'Müşteri başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    }


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