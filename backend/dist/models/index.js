"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Admin = require('./Admin')(database_1.sequelize, sequelize_1.DataTypes);
const Staff = require('./Staff')(database_1.sequelize, sequelize_1.DataTypes);
const Customer = require('./Customer')(database_1.sequelize, sequelize_1.DataTypes);
const BusinessHours = require('./BusinessHours')(database_1.sequelize, sequelize_1.DataTypes);
const SpecialDays = require('./SpecialDays')(database_1.sequelize, sequelize_1.DataTypes);
const ServiceCategory = require('./ServiceCategory')(database_1.sequelize, sequelize_1.DataTypes);
const Service = require('./Service')(database_1.sequelize, sequelize_1.DataTypes);
const ServiceImage = require('./ServiceImage')(database_1.sequelize, sequelize_1.DataTypes);
const Appointment = require('./Appointment')(database_1.sequelize, sequelize_1.DataTypes);
const AppointmentHistory = require('./AppointmentHistory')(database_1.sequelize, sequelize_1.DataTypes);
const ContactMessage = require('./ContactMessage')(database_1.sequelize, sequelize_1.DataTypes);
const GalleryCategory = require('./GalleryCategory')(database_1.sequelize, sequelize_1.DataTypes);
const GalleryImage = require('./GalleryImage')(database_1.sequelize, sequelize_1.DataTypes);
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
    sequelize: database_1.sequelize,
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
};
exports.default = db;
//# sourceMappingURL=index.js.map