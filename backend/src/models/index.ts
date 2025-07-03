import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
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
const EmailTemplate = require('./EmailTemplate')(sequelize, DataTypes);

const setupAssociations = () => {
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
};

setupAssociations();

const db = {
  sequelize,
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
  EmailTemplate,
};
export default db; 