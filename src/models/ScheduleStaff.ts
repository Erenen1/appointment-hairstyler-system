module.exports = (sequelize: any, DataTypes: any) => {
  const ScheduleStaff = sequelize.define('ScheduleStaff', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID },
    full_name: { type: DataTypes.TEXT, allowNull: false },
    specialties: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    phone: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'staff',
    schema: 'schedule',
  });
  return ScheduleStaff;
};


