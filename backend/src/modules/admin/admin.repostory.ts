import { Op } from 'sequelize';
import db from '../../models/index';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { IAdmin } from './admin.interface';
import { BaseRepository } from '../common/base.repository';

const { Admin } = db;

class AdminRepository extends BaseRepository<IAdmin> {
    constructor() {
        super(Admin);
    }

    /**
     * Email'e göre admin getirir
     */
    public async findByEmail(email: string): Promise<IAdmin | null> {
        return await this.findOne({ email });
    }

    /**
     * Admin şifresini günceller
     */
    public async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await this.update(id, { password: hashedPassword });
    }
}

export default AdminRepository;
