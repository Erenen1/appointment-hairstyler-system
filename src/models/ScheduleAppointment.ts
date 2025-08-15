module.exports = (sequelize: any, DataTypes: any) => {
  const ScheduleAppointment = sequelize.define('ScheduleAppointment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    staff_id: { type: DataTypes.UUID, allowNull: false },
    service_id: { type: DataTypes.UUID, allowNull: false },
    status_id: { type: DataTypes.UUID, allowNull: false },
    appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    notes: { type: DataTypes.TEXT },
    duration_mins: { type: DataTypes.SMALLINT },
    price: { type: DataTypes.DECIMAL(14,2) },
    owner_user_id: { type: DataTypes.UUID },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'appointments',
    schema: 'schedule',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ScheduleAppointment;
};


