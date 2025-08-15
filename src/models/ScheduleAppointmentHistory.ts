module.exports = (sequelize: any, DataTypes: any) => {
  const ScheduleAppointmentHistory = sequelize.define('ScheduleAppointmentHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    appointment_id: { type: DataTypes.UUID, allowNull: false },
    from_status_id: { type: DataTypes.UUID },
    to_status_id: { type: DataTypes.UUID, allowNull: false },
    changed_by: { type: DataTypes.UUID },
    changed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    note: { type: DataTypes.TEXT },
  }, {
    tableName: 'appointment_history',
    schema: 'schedule',
    timestamps: false,
  });
  return ScheduleAppointmentHistory;
};


