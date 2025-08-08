import { ApiError } from "../../utils";
import CustomerRepository from "./customer.repository";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./dto";
import { ICustomer } from "./customer.interface";
import { Express } from "express";


class CustomerService {
    private customerRepository: CustomerRepository;

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository;
    }


    public async getAllCustomers(): Promise<ICustomer[]> {
        return await this.customerRepository.getAllCustomers();
    }


    public async getCustomerById(id: string): Promise<ICustomer> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw ApiError.notFound('Müşteri bulunamadı');
        }
        return customer;
    }

    public async createCustomer(customerDto: CustomerCreateDTO, req: Express.Request): Promise<any> {
        const existingEmail = await this.customerRepository.findByEmail(customerDto.email);
        if (!existingEmail) {
            const newCustomer = await this.customerRepository.createCustomer(customerDto as ICustomer);
            const newCustomerBusiness = await this.customerRepository.createCustomerBusinessAssociation(newCustomer.id, req.businessId);
            const response = {
                newCustomer,
                newCustomerBusiness
            }
            return response;
        }
        return existingEmail;
    }

    public async updateCustomer(id: string, customerDto: CustomerUpdateDTO): Promise<ICustomer> {
        const existingCustomer = await this.customerRepository.findById(id);
        if (!existingCustomer) {
            throw ApiError.notFound('Güncellenecek müşteri bulunamadı');
        }

        if (customerDto.email && customerDto.email !== existingCustomer.email) {
            const existingEmail = await this.customerRepository.findByEmail(customerDto.email);
            if (existingEmail) {
                throw ApiError.badRequest('Bu e-posta adresi ile kayıtlı başka bir müşteri zaten mevcut');
            }
        }

        if (customerDto.phone && customerDto.phone !== existingCustomer.phone) {
            const existingPhone = await this.customerRepository.findByPhone(customerDto.phone);
            if (existingPhone) {
                throw ApiError.badRequest('Bu telefon numarası ile kayıtlı başka bir müşteri zaten mevcut');
            }
        }

        const updatedCustomer = await this.customerRepository.updateCustomer(id, customerDto as ICustomer);
        if (!updatedCustomer) {
            throw ApiError.internal('Müşteri güncellenirken bir hata oluştu');
        }

        return updatedCustomer;
    }

    public async deleteCustomer(id: string): Promise<boolean> {
        const existingCustomer = await this.customerRepository.findById(id);
        if (!existingCustomer) {
            throw ApiError.notFound('Silinecek müşteri bulunamadı');
        }

        const result = await this.customerRepository.deleteCustomer(id);
        if (!result) {
            throw ApiError.internal('Müşteri silinirken bir hata oluştu');
        }

        return result;
    }
}

export default CustomerService; 