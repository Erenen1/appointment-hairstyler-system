import { sequelize } from '../../config/database';
import { Op } from 'sequelize';

export class AuthRepository {
  private get model() {
    return sequelize.models.AuthUser as any;
  }

  async findUserByUsernameOrEmail(tenantId: string, usernameOrEmail: string) {
    const user = await this.model.findOne({
      where: {
        tenant_id: tenantId,
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      attributes: [
        'id','tenant_id','username','email','first_name','last_name','phone',
        'role','is_active','last_login','password_hash','created_at','updated_at'
      ],
    });
    return user ? user.toJSON() : null;
  }

  async updateLastLogin(userId: string) {
    await this.model.update(
      { last_login: new Date() },
      { where: { id: userId } }
    );
  }

  async findById(userId: string) {
    const user = await this.model.findByPk(userId, {
      attributes: [
        'id','tenant_id','username','email','first_name','last_name','phone',
        'role','is_active','last_login','password_hash','created_at','updated_at'
      ],
    });
    return user ? user.toJSON() : null;
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await this.model.update(
      { password_hash: hashedPassword },
      { where: { id: userId } }
    );
  }

  async createUser(data: { tenantId: string; username: string; email: string; passwordHash: string; role?: string }) {
    const created = await (this.model as any).create({
      tenant_id: data.tenantId,
      username: data.username,
      email: data.email,
      password_hash: data.passwordHash,
      role: data.role || 'user',
      is_active: true,
    });
    return created.toJSON();
  }
}

export default AuthRepository;


