module.exports = (sequelize: any, DataTypes: any) => {
  const ScheduleAppointmentStatus = sequelize.define('ScheduleAppointmentStatus', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    display_name: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.TEXT },
    code: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'appointment_statuses',
    schema: 'schedule',
  });
  return ScheduleAppointmentStatus;
};


