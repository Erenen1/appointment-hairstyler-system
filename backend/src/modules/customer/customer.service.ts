import { ApiError } from "../../utils/ApiError";
import CustomerRepository from "./customer.repository";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./dto";
import { ICustomer } from "./customer.interface";

/**
 * Müşteri işlemleri için servis sınıfı
 */
class CustomerService {
    private customerRepository: CustomerRepository;

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Tüm müşterileri getirir
     * @returns Müşteri listesi
     */
    public async getAllCustomers(): Promise<ICustomer[]> {
        return await this.customerRepository.getAllCustomers();
    }

    /**
     * ID'ye göre müşteri getirir
     * @param id Müşteri ID
     * @returns Müşteri bilgileri
     */
    public async getCustomerById(id: string): Promise<ICustomer> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw ApiError.notFound('Müşteri bulunamadı');
        }
        return customer;
    }

    /**
     * Yeni müşteri oluşturur
     * @param customerDto Müşteri bilgileri
     * @returns Oluşturulan müşteri
     */
    public async createCustomer(customerDto: CustomerCreateDTO): Promise<ICustomer> {
        // E-posta kontrolü
        const existingEmail = await this.customerRepository.findByEmail(customerDto.email);
        if (!existingEmail) {
            const newCustomer = await this.customerRepository.createCustomer(customerDto as ICustomer);
            return newCustomer;
        }
        return existingEmail;
    }

    /**
     * Müşteri bilgilerini günceller
     * @param id Müşteri ID
     * @param customerDto Güncellenecek müşteri bilgileri
     * @returns Güncellenen müşteri
     */
    public async updateCustomer(id: string, customerDto: CustomerUpdateDTO): Promise<ICustomer> {
        // Müşteri kontrolü
        const existingCustomer = await this.customerRepository.findById(id);
        if (!existingCustomer) {
            throw ApiError.notFound('Güncellenecek müşteri bulunamadı');
        }

        // E-posta kontrolü (eğer değiştiriliyorsa)
        if (customerDto.email && customerDto.email !== existingCustomer.email) {
            const existingEmail = await this.customerRepository.findByEmail(customerDto.email);
            if (existingEmail) {
                throw ApiError.badRequest('Bu e-posta adresi ile kayıtlı başka bir müşteri zaten mevcut');
            }
        }

        // Telefon kontrolü (eğer değiştiriliyorsa)
        if (customerDto.phone && customerDto.phone !== existingCustomer.phone) {
            const existingPhone = await this.customerRepository.findByPhone(customerDto.phone);
            if (existingPhone) {
                throw ApiError.badRequest('Bu telefon numarası ile kayıtlı başka bir müşteri zaten mevcut');
            }
        }

        // Müşteri güncelle
        const updatedCustomer = await this.customerRepository.updateCustomer(id, customerDto as ICustomer);
        if (!updatedCustomer) {
            throw ApiError.internal('Müşteri güncellenirken bir hata oluştu');
        }
        
        return updatedCustomer;
    }

    /**
     * Müşteri kaydını siler
     * @param id Müşteri ID
     * @returns İşlem başarılı ise true
     */
    public async deleteCustomer(id: string): Promise<boolean> {
        // Müşteri kontrolü
        const existingCustomer = await this.customerRepository.findById(id);
        if (!existingCustomer) {
            throw ApiError.notFound('Silinecek müşteri bulunamadı');
        }

        // Müşteri sil
        const result = await this.customerRepository.deleteCustomer(id);
        if (!result) {
            throw ApiError.internal('Müşteri silinirken bir hata oluştu');
        }
        
        return result;
    }
}

export default CustomerService; 