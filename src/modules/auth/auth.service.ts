import { ApiError } from '../../utils/ApiError';
import { HashUtils } from '../../utils/hashUtils';
import { JwtUtils } from '../../utils/jwtUtils';
import { AuthRepository } from './auth.repository';
import { AuthUserResponse, LoginDto, RegisterDto } from './types/auth.types';

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  private toResponse(user: any): AuthUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async login(tenantId: string, dto: LoginDto) {
    const user = await this.repo.findUserByUsernameOrEmail(tenantId, dto.username);
    if (!user) throw ApiError.authentication('Kullanıcı bulunamadı');

    const ok = HashUtils.verifyPassword(dto.password, user.password_hash || '');
    if (!ok) throw ApiError.authentication('Kullanıcı adı veya şifre hatalı');
    if (!user.is_active) throw ApiError.authentication('Hesap pasif');

    await this.repo.updateLastLogin(user.id);

    const token = JwtUtils.generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      username: user.username,
      role: user.role,
    });
    const refreshToken = JwtUtils.generateRefreshToken({
      userId: user.id,
      tenantId: user.tenant_id,
      username: user.username,
      role: user.role,
    });

    const resUser = this.toResponse(user);
    return { user: resUser, token, refreshToken };
  }

  async register(tenantId: string, dto: RegisterDto) {
    const existing = await this.repo.findUserByUsernameOrEmail(tenantId, dto.username) || await this.repo.findUserByUsernameOrEmail(tenantId, dto.email);
    if (existing) throw ApiError.conflict('Kullanıcı adı veya email zaten kayıtlı');
    const passwordHash = HashUtils.hashPassword(dto.password);
    const user = await this.repo.createUser({ tenantId, username: dto.username, email: dto.email, passwordHash, role: dto.role });
    const token = JwtUtils.generateToken({ userId: user.id, tenantId: user.tenant_id, username: user.username, role: user.role });
    const refreshToken = JwtUtils.generateRefreshToken({ userId: user.id, tenantId: user.tenant_id, username: user.username, role: user.role });
    return { user: this.toResponse(user), token, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = JwtUtils.verifyRefreshToken(refreshToken);
    if (!payload.userId) throw ApiError.authentication('Geçersiz refresh token');
    const user = await this.repo.findById(payload.userId);
    if (!user || !user.is_active) throw ApiError.authentication('Hesap pasif veya bulunamadı');
    const token = JwtUtils.generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      username: user.username,
      role: user.role,
    });
    return { token };
  }

  async requestPasswordReset(tenantId: string, email: string) {
    const user = await this.repo.findUserByUsernameOrEmail(tenantId, email);
    if (!user) return { ok: true }; // bilgi sızdırma engeli
    const token = JwtUtils.generatePasswordResetToken({ userId: user.id, tenantId, email: user.email });
    // TODO: mail gönderimi burada (SMTP ayarlarıyla)
    return { ok: true, token }; // şimdilik geliştirme amaçlı token döndürüyoruz
  }

  async confirmPasswordReset(resetToken: string, newPassword: string) {
    const { userId } = JwtUtils.verifyPasswordResetToken(resetToken);
    const hashed = HashUtils.hashPassword(newPassword);
    await this.repo.updatePassword(userId, hashed);
    return { ok: true };
  }
}

export default AuthService;


