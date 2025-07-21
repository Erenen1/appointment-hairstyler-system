import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
const Business = require('./Business')(sequelize, DataTypes);
const Admin = require('./Admin')(sequelize, DataTypes);
const Staff = require('./Staff')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const BusinessHours = require('./BusinessHours')(sequelize, DataTypes);
const SpecialDays = require('./SpecialDays')(sequelize, DataTypes);
const ServiceCategory = require('./ServiceCategory')(sequelize, DataTypes);
const Service = require('./Service')(sequelize, DataTypes);
const ServiceImage = require('./ServiceImage')(sequelize, DataTypes);
const Appointment = require('./Appointment')(sequelize, DataTypes);
const AppointmentHistory = require('./AppointmentHistory')(sequelize, DataTypes);
const ContactMessage = require('./ContactMessage')(sequelize, DataTypes);
const GalleryCategory = require('./GalleryCategory')(sequelize, DataTypes);
const GalleryImage = require('./GalleryImage')(sequelize, DataTypes);
const StaffService = require('./StaffService')(sequelize, DataTypes);
const StaffAvailability = require('./StaffAvailability')(sequelize, DataTypes);

const setupAssociations = () => {
  // Business ilişkileri
  Business.hasMany(Staff, { foreignKey: 'businessId', as: 'staff' });
  Staff.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
  
  Business.hasMany(Service, { foreignKey: 'businessId', as: 'services' });
  Service.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
  
  Business.hasMany(ServiceCategory, { foreignKey: 'businessId', as: 'serviceCategories' });
  ServiceCategory.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
  
  Business.hasMany(Customer, { foreignKey: 'businessId', as: 'customers' });
  Customer.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
  
  Business.hasMany(Appointment, { foreignKey: 'businessId', as: 'appointments' });
  Appointment.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
  
  Business.hasMany(Admin, { foreignKey: 'businessId', as: 'admins' });
  Admin.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });

  // Mevcut ilişkiler
  ServiceCategory.hasMany(Service, { foreignKey: 'categoryId', as: 'services' });
  Service.belongsTo(ServiceCategory, { foreignKey: 'categoryId', as: 'category' });
  Service.hasMany(ServiceImage, { foreignKey: 'serviceId', as: 'images' });
  ServiceImage.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
  Customer.hasMany(Appointment, { foreignKey: 'customerId', as: 'appointments' });
  Appointment.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
  Staff.hasMany(Appointment, { foreignKey: 'staffId', as: 'appointments' });
  Appointment.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
  Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });
  Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
  Admin.hasMany(Appointment, { foreignKey: 'createdByAdmin', as: 'createdAppointments' });
  Appointment.belongsTo(Admin, { foreignKey: 'createdByAdmin', as: 'createdBy' });
  Appointment.hasMany(AppointmentHistory, { foreignKey: 'appointmentId', as: 'history' });
  AppointmentHistory.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
  Admin.hasMany(AppointmentHistory, { foreignKey: 'createdByAdmin', as: 'appointmentHistory' });
  AppointmentHistory.belongsTo(Admin, { foreignKey: 'createdByAdmin', as: 'createdBy' });
  Admin.hasMany(ContactMessage, { foreignKey: 'repliedByAdmin', as: 'repliedMessages' });
  ContactMessage.belongsTo(Admin, { foreignKey: 'repliedByAdmin', as: 'repliedBy' });
  GalleryCategory.hasMany(GalleryImage, { foreignKey: 'categoryId', as: 'images' });
  GalleryImage.belongsTo(GalleryCategory, { foreignKey: 'categoryId', as: 'category' });

  // Staff-Service many-to-many ilişkisi
  Staff.belongsToMany(Service, { through: StaffService, foreignKey: 'staffId', otherKey: 'serviceId', as: 'services' });
  Service.belongsToMany(Staff, { through: StaffService, foreignKey: 'serviceId', otherKey: 'staffId', as: 'staffMembers' });

  // StaffService ile Staff ve Service arasındaki direkt ilişkiler
  StaffService.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
  StaffService.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
  Staff.hasMany(StaffService, { foreignKey: 'staffId', as: 'staffServices' });
  Service.hasMany(StaffService, { foreignKey: 'serviceId', as: 'serviceStaff' });

  // StaffAvailability ilişkileri
  Staff.hasMany(StaffAvailability, { foreignKey: 'staffId', as: 'availability' });
  StaffAvailability.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
};

setupAssociations();

const db = {
  sequelize,
  Business,
  Admin,
  Staff,
  Customer,
  BusinessHours,
  SpecialDays,
  ServiceCategory,
  Service,
  ServiceImage,
  Appointment,
  AppointmentHistory,
  ContactMessage,
  GalleryCategory,
  GalleryImage,
  StaffService,
  StaffAvailability,
};
export default db; 