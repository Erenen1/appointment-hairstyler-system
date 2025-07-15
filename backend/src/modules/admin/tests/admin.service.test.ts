import { HashUtils, ApiError } from '../../../utils';
import AdminService from '../admin.service';
import { CreateAdminDto, UpdateAdminDto } from '../dto';
import { IAdmin } from '../admin.interface';

// Mock repository
const mockAdminRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn()
};

// Mock HashUtils
jest.mock('../../../utils', () => ({
    HashUtils: {
        hashPassword: jest.fn().mockReturnValue('hashed_password'),
        verifyPassword: jest.fn()
    },
    ApiError: {
        conflict: jest.fn().mockImplementation((message) => ({ message })),
        notFound: jest.fn().mockImplementation((message) => ({ message })),
        authentication: jest.fn().mockImplementation((message) => ({ message })),
        internal: jest.fn().mockImplementation((message) => ({ message }))
    }
}));

describe('AdminService', () => {
    let adminService: AdminService;
    
    beforeEach(() => {
        jest.clearAllMocks();
        adminService = new AdminService(mockAdminRepository as any);
    });
    
    describe('createAdmin', () => {
        const createAdminDto: CreateAdminDto = {
            fullName: 'Test Admin',
            email: 'test@example.com',
            password: 'password123',
            phone: '5551234567',
            isActive: true
        };
        
        const mockAdmin: IAdmin = {
            id: '1',
            fullName: 'Test Admin',
            email: 'test@example.com',
            password: 'hashed_password',
            phone: '5551234567',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        it('should create a new admin successfully', async () => {
            // Arrange
            mockAdminRepository.findByEmail.mockResolvedValue(null);
            mockAdminRepository.create.mockResolvedValue(mockAdmin);
            
            // Act
            const result = await adminService.createAdmin(createAdminDto);
            
            // Assert
            expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith(createAdminDto.email);
            expect(HashUtils.hashPassword).toHaveBeenCalledWith(createAdminDto.password);
            expect(mockAdminRepository.create).toHaveBeenCalledWith({
                ...createAdminDto,
                password: 'hashed_password'
            });
            expect(result).toEqual({
                id: '1',
                fullName: 'Test Admin',
                email: 'test@example.com',
                phone: '5551234567',
                isActive: true,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(result).not.toHaveProperty('password');
        });
        
        it('should throw conflict error if email already exists', async () => {
            // Arrange
            mockAdminRepository.findByEmail.mockResolvedValue(mockAdmin);
            
            // Act & Assert
            await expect(adminService.createAdmin(createAdminDto))
                .rejects.toEqual(expect.objectContaining({
                    message: 'Bu e-posta adresi zaten kullanılıyor'
                }));
            expect(mockAdminRepository.create).not.toHaveBeenCalled();
        });
    });
    
    describe('getAllAdmins', () => {
        it('should return all admins without passwords', async () => {
            // Arrange
            const mockAdmins: IAdmin[] = [
                {
                    id: '1',
                    fullName: 'Admin 1',
                    email: 'admin1@example.com',
                    password: 'hashed_password',
                    phone: '5551234567',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    fullName: 'Admin 2',
                    email: 'admin2@example.com',
                    password: 'hashed_password',
                    phone: '5559876543',
                    isActive: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            
            mockAdminRepository.findAll.mockResolvedValue(mockAdmins);
            
            // Act
            const result = await adminService.getAllAdmins();
            
            // Assert
            expect(mockAdminRepository.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]).not.toHaveProperty('password');
            expect(result[1]).not.toHaveProperty('password');
            expect(result[0].id).toBe('1');
            expect(result[1].id).toBe('2');
        });
    });
    
    // Diğer test senaryolarını da benzer şekilde ekleyebilirsiniz
}); 