import { ICustomer } from "./customer.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models";


const { Customer, CustomerBusiness } = db;

/**
 * Müşteri veritabanı işlemleri için repository sınıfı
 */
class CustomerRepository extends BaseRepository<ICustomer> {
    constructor() {
        super(Customer);
    }

    /**
     * E-posta adresine göre müşteri arar
     * @param email Müşteri e-posta adresi
     * @returns Bulunan müşteri veya null
     */
    public async findByEmail(email: string): Promise<ICustomer | null> {
        return await this.findOne({ email });
    }

    /**
     * Telefon numarasına göre müşteri arar
     * @param phone Müşteri telefon numarası
     * @returns Bulunan müşteri veya null
     */
    public async findByPhone(phone: string): Promise<ICustomer | null> {
        return await this.findOne({ phone });
    }

    /**
     * ID'ye göre müşteri arar
     * @param id Müşteri ID
     * @returns Bulunan müşteri veya null
     */
    public async findById(id: string): Promise<ICustomer | null> {
        return await this.findOne({ id });
    }

    /**
     * Tüm müşterileri getirir
     * @returns Müşteri listesi
     */
    public async getAllCustomers(): Promise<ICustomer[]> {
        return await super.findAll();
    }

    /**
     * Yeni müşteri oluşturur
     * @param customer Müşteri bilgileri
     * @returns Oluşturulan müşteri
     */
    public async createCustomer(customer: ICustomer): Promise<ICustomer> {
        return await this.create(customer);
    }

    /**
     * Müşteri bilgilerini günceller
     * @param id Müşteri ID
     * @param customer Güncellenecek müşteri bilgileri
     * @returns Güncellenen müşteri veya null
     */
    public async updateCustomer(id: string, customer: ICustomer): Promise<ICustomer | null> {
        return await this.update(id, customer);
    }

    /**
     * Müşteri kaydını siler
     * @param id Müşteri ID
     * @returns İşlem başarılı ise true
     */
    public async deleteCustomer(id: string): Promise<boolean> {
        return await this.delete(id);
    }

    public async createCustomerBusinessAssociation(customerId: string, businessId: string): Promise<void> {
        await CustomerBusiness.create({ customerId, businessId });
    }
}

export default CustomerRepository;