import { Sequelize, DataTypes } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCoreTenant = require('./CoreTenant');

// auth
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAuthUser = require('./AuthUser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAuthRole = require('./AuthRole');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAuthPermission = require('./AuthPermission');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAuthRolePermission = require('./AuthRolePermission');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAuthUserRole = require('./AuthUserRole');

// settings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineBusinessSettings = require('./SettingsBusinessSettings');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineNotificationSettings = require('./SettingsNotificationSettings');

// geo
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineGeoCity = require('./GeoCity');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineGeoDistrict = require('./GeoDistrict');

// crm
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCrmCustomer = require('./CrmCustomer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCrmCustomerPreferredDistrict = require('./CrmCustomerPreferredDistrict');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCrmRequirement = require('./CrmRequirement');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCrmCustomerRequirement = require('./CrmCustomerRequirement');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineCrmCustomerViewedProperty = require('./CrmCustomerViewedProperty');

// listings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsProperty = require('./ListingsProperty');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsPropertyImage = require('./ListingsPropertyImage');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsAmenity = require('./ListingsAmenity');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsPropertyAmenity = require('./ListingsPropertyAmenity');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsTag = require('./ListingsTag');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsPropertyTag = require('./ListingsPropertyTag');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineListingsPropertyEvent = require('./ListingsPropertyEvent');

// schedule
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineScheduleService = require('./ScheduleService');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineScheduleStaff = require('./ScheduleStaff');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineScheduleAppointmentStatus = require('./ScheduleAppointmentStatus');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineScheduleAppointment = require('./ScheduleAppointment');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineScheduleAppointmentHistory = require('./ScheduleAppointmentHistory');

// finance
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceIncomeCategory = require('./FinanceIncomeCategory');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceIncome = require('./FinanceIncome');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceExpenseCategory = require('./FinanceExpenseCategory');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceExpense = require('./FinanceExpense');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceCurrentAccount = require('./FinanceCurrentAccount');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineFinanceCurrentAccountTransaction = require('./FinanceCurrentAccountTransaction');

// messaging
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineMessagingWhatsappBotConfig = require('./MessagingWhatsappBotConfig');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineMessagingWhatsappContact = require('./MessagingWhatsappContact');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineMessagingWhatsappMessage = require('./MessagingWhatsappMessage');

// analytics
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defineAnalyticsPropertyMetricsDaily = require('./AnalyticsPropertyMetricsDaily');

export const initModels = (sequelize: Sequelize) => {
  const t = DataTypes;

  const CoreTenant = defineCoreTenant(sequelize, t);

  const AuthUser = defineAuthUser(sequelize, t);
  const AuthRole = defineAuthRole(sequelize, t);
  const AuthPermission = defineAuthPermission(sequelize, t);
  const AuthRolePermission = defineAuthRolePermission(sequelize, t);
  const AuthUserRole = defineAuthUserRole(sequelize, t);

  const SettingsBusiness = defineBusinessSettings(sequelize, t);
  const SettingsNotification = defineNotificationSettings(sequelize, t);

  const GeoCity = defineGeoCity(sequelize, t);
  const GeoDistrict = defineGeoDistrict(sequelize, t);

  const CrmCustomer = defineCrmCustomer(sequelize, t);
  const CrmCustomerPreferredDistrict = defineCrmCustomerPreferredDistrict(sequelize, t);
  const CrmRequirement = defineCrmRequirement(sequelize, t);
  const CrmCustomerRequirement = defineCrmCustomerRequirement(sequelize, t);
  const CrmCustomerViewedProperty = defineCrmCustomerViewedProperty(sequelize, t);

  const ListingsProperty = defineListingsProperty(sequelize, t);
  const ListingsPropertyImage = defineListingsPropertyImage(sequelize, t);
  const ListingsAmenity = defineListingsAmenity(sequelize, t);
  const ListingsPropertyAmenity = defineListingsPropertyAmenity(sequelize, t);
  const ListingsTag = defineListingsTag(sequelize, t);
  const ListingsPropertyTag = defineListingsPropertyTag(sequelize, t);
  const ListingsPropertyEvent = defineListingsPropertyEvent(sequelize, t);

  const ScheduleService = defineScheduleService(sequelize, t);
  const ScheduleStaff = defineScheduleStaff(sequelize, t);
  const ScheduleAppointmentStatus = defineScheduleAppointmentStatus(sequelize, t);
  const ScheduleAppointment = defineScheduleAppointment(sequelize, t);
  const ScheduleAppointmentHistory = defineScheduleAppointmentHistory(sequelize, t);

  const FinanceIncomeCategory = defineFinanceIncomeCategory(sequelize, t);
  const FinanceIncome = defineFinanceIncome(sequelize, t);
  const FinanceExpenseCategory = defineFinanceExpenseCategory(sequelize, t);
  const FinanceExpense = defineFinanceExpense(sequelize, t);
  const FinanceCurrentAccount = defineFinanceCurrentAccount(sequelize, t);
  const FinanceCurrentAccountTransaction = defineFinanceCurrentAccountTransaction(sequelize, t);

  const MessagingWhatsappBotConfig = defineMessagingWhatsappBotConfig(sequelize, t);
  const MessagingWhatsappContact = defineMessagingWhatsappContact(sequelize, t);
  const MessagingWhatsappMessage = defineMessagingWhatsappMessage(sequelize, t);

  const AnalyticsPropertyMetricsDaily = defineAnalyticsPropertyMetricsDaily(sequelize, t);

  // Associations
  // core <-> auth
  CoreTenant.hasMany(AuthUser, { foreignKey: 'tenant_id' });
  AuthUser.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(AuthRole, { foreignKey: 'tenant_id' });
  AuthRole.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });

  AuthRole.belongsToMany(AuthPermission, { through: AuthRolePermission, foreignKey: 'role_id', otherKey: 'permission_id' });
  AuthPermission.belongsToMany(AuthRole, { through: AuthRolePermission, foreignKey: 'permission_id', otherKey: 'role_id' });

  AuthUser.belongsToMany(AuthRole, { through: AuthUserRole, foreignKey: 'user_id', otherKey: 'role_id' });
  AuthRole.belongsToMany(AuthUser, { through: AuthUserRole, foreignKey: 'role_id', otherKey: 'user_id' });

  // settings
  CoreTenant.hasOne(SettingsBusiness, { foreignKey: 'tenant_id' });
  SettingsBusiness.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasOne(SettingsNotification, { foreignKey: 'tenant_id' });
  SettingsNotification.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });

  // geo
  GeoCity.hasMany(GeoDistrict, { foreignKey: 'city_id' });
  GeoDistrict.belongsTo(GeoCity, { foreignKey: 'city_id' });

  // crm
  CoreTenant.hasMany(CrmCustomer, { foreignKey: 'tenant_id' });
  CrmCustomer.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CrmCustomer.belongsTo(AuthUser, { foreignKey: 'assigned_agent_id', as: 'assigned_agent' });
  AuthUser.hasMany(CrmCustomer, { foreignKey: 'assigned_agent_id', as: 'assigned_customers' });

  CoreTenant.hasMany(CrmRequirement, { foreignKey: 'tenant_id' });
  CrmRequirement.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });

  CrmCustomer.belongsToMany(GeoDistrict, { through: CrmCustomerPreferredDistrict, foreignKey: 'customer_id', otherKey: 'district_id' });
  GeoDistrict.belongsToMany(CrmCustomer, { through: CrmCustomerPreferredDistrict, foreignKey: 'district_id', otherKey: 'customer_id' });

  CrmCustomer.belongsToMany(CrmRequirement, { through: CrmCustomerRequirement, foreignKey: 'customer_id', otherKey: 'requirement_id' });
  CrmRequirement.belongsToMany(CrmCustomer, { through: CrmCustomerRequirement, foreignKey: 'requirement_id', otherKey: 'customer_id' });

  CrmCustomer.belongsToMany(ListingsProperty, { through: CrmCustomerViewedProperty, foreignKey: 'customer_id', otherKey: 'property_id', as: 'viewed_properties' });
  ListingsProperty.belongsToMany(CrmCustomer, { through: CrmCustomerViewedProperty, foreignKey: 'property_id', otherKey: 'customer_id', as: 'viewed_by_customers' });

  // listings
  CoreTenant.hasMany(ListingsProperty, { foreignKey: 'tenant_id' });
  ListingsProperty.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ListingsProperty.belongsTo(GeoDistrict, { foreignKey: 'district_id' });
  ListingsProperty.belongsTo(GeoCity, { foreignKey: 'city_id' });
  ListingsProperty.belongsTo(AuthUser, { foreignKey: 'agent_id', as: 'agent' });
  ListingsProperty.belongsTo(CrmCustomer, { foreignKey: 'owner_customer_id', as: 'owner_customer' });
  ListingsProperty.hasMany(ListingsPropertyImage, { foreignKey: 'property_id' });
  ListingsPropertyImage.belongsTo(ListingsProperty, { foreignKey: 'property_id' });

  CoreTenant.hasMany(ListingsAmenity, { foreignKey: 'tenant_id' });
  ListingsAmenity.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ListingsProperty.belongsToMany(ListingsAmenity, { through: ListingsPropertyAmenity, foreignKey: 'property_id', otherKey: 'amenity_id' });
  ListingsAmenity.belongsToMany(ListingsProperty, { through: ListingsPropertyAmenity, foreignKey: 'amenity_id', otherKey: 'property_id' });

  CoreTenant.hasMany(ListingsTag, { foreignKey: 'tenant_id' });
  ListingsTag.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ListingsProperty.belongsToMany(ListingsTag, { through: ListingsPropertyTag, foreignKey: 'property_id', otherKey: 'tag_id' });
  ListingsTag.belongsToMany(ListingsProperty, { through: ListingsPropertyTag, foreignKey: 'tag_id', otherKey: 'property_id' });

  CoreTenant.hasMany(ListingsPropertyEvent, { foreignKey: 'tenant_id' });
  ListingsPropertyEvent.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ListingsPropertyEvent.belongsTo(ListingsProperty, { foreignKey: 'property_id' });
  ListingsPropertyEvent.belongsTo(CrmCustomer, { foreignKey: 'customer_id' });

  // schedule
  CoreTenant.hasMany(ScheduleService, { foreignKey: 'tenant_id' });
  ScheduleService.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(ScheduleStaff, { foreignKey: 'tenant_id' });
  ScheduleStaff.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ScheduleStaff.belongsTo(AuthUser, { foreignKey: 'user_id' });
  CoreTenant.hasMany(ScheduleAppointmentStatus, { foreignKey: 'tenant_id' });
  ScheduleAppointmentStatus.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(ScheduleAppointment, { foreignKey: 'tenant_id' });
  ScheduleAppointment.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  ScheduleAppointment.belongsTo(CrmCustomer, { foreignKey: 'customer_id' });
  ScheduleAppointment.belongsTo(ScheduleStaff, { foreignKey: 'staff_id' });
  ScheduleAppointment.belongsTo(ScheduleService, { foreignKey: 'service_id' });
  ScheduleAppointment.belongsTo(ScheduleAppointmentStatus, { foreignKey: 'status_id' });
  ScheduleAppointmentHistory.belongsTo(ScheduleAppointment, { foreignKey: 'appointment_id' });
  ScheduleAppointmentHistory.belongsTo(ScheduleAppointmentStatus, { foreignKey: 'from_status_id', as: 'from_status' });
  ScheduleAppointmentHistory.belongsTo(ScheduleAppointmentStatus, { foreignKey: 'to_status_id', as: 'to_status' });
  ScheduleAppointmentHistory.belongsTo(AuthUser, { foreignKey: 'changed_by', as: 'changed_by_user' });

  // finance
  CoreTenant.hasMany(FinanceIncomeCategory, { foreignKey: 'tenant_id' });
  FinanceIncomeCategory.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(FinanceIncome, { foreignKey: 'tenant_id' });
  FinanceIncome.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  FinanceIncome.belongsTo(FinanceIncomeCategory, { foreignKey: 'category_id' });
  CoreTenant.hasMany(FinanceExpenseCategory, { foreignKey: 'tenant_id' });
  FinanceExpenseCategory.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(FinanceExpense, { foreignKey: 'tenant_id' });
  FinanceExpense.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  FinanceExpense.belongsTo(FinanceExpenseCategory, { foreignKey: 'category_id' });
  CoreTenant.hasMany(FinanceCurrentAccount, { foreignKey: 'tenant_id' });
  FinanceCurrentAccount.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  FinanceCurrentAccount.belongsTo(CrmCustomer, { foreignKey: 'customer_id' });
  FinanceCurrentAccount.hasMany(FinanceCurrentAccountTransaction, { foreignKey: 'account_id' });
  FinanceCurrentAccountTransaction.belongsTo(FinanceCurrentAccount, { foreignKey: 'account_id' });

  // messaging
  CoreTenant.hasMany(MessagingWhatsappBotConfig, { foreignKey: 'tenant_id' });
  MessagingWhatsappBotConfig.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  CoreTenant.hasMany(MessagingWhatsappContact, { foreignKey: 'tenant_id' });
  MessagingWhatsappContact.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });
  MessagingWhatsappMessage.belongsTo(MessagingWhatsappContact, { foreignKey: 'contact_id' });
  MessagingWhatsappContact.hasMany(MessagingWhatsappMessage, { foreignKey: 'contact_id' });
  MessagingWhatsappMessage.belongsTo(CoreTenant, { foreignKey: 'tenant_id' });

  // analytics
  // Primary key is composite on the model; relations are optional

  return {
    CoreTenant,
    AuthUser,
    AuthRole,
    AuthPermission,
    AuthRolePermission,
    AuthUserRole,
    SettingsBusiness,
    SettingsNotification,
    GeoCity,
    GeoDistrict,
    CrmCustomer,
    CrmCustomerPreferredDistrict,
    CrmRequirement,
    CrmCustomerRequirement,
    CrmCustomerViewedProperty,
    ListingsProperty,
    ListingsPropertyImage,
    ListingsAmenity,
    ListingsPropertyAmenity,
    ListingsTag,
    ListingsPropertyTag,
    ListingsPropertyEvent,
    ScheduleService,
    ScheduleStaff,
    ScheduleAppointmentStatus,
    ScheduleAppointment,
    ScheduleAppointmentHistory,
    FinanceIncomeCategory,
    FinanceIncome,
    FinanceExpenseCategory,
    FinanceExpense,
    FinanceCurrentAccount,
    FinanceCurrentAccountTransaction,
    MessagingWhatsappBotConfig,
    MessagingWhatsappContact,
    MessagingWhatsappMessage,
    AnalyticsPropertyMetricsDaily,
  } as const;
};

export default initModels;


