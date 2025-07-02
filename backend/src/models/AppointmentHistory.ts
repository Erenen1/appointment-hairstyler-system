module.exports = (sequelize: any, DataTypes: any) => {
  const AppointmentHistory = sequelize.define('AppointmentHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdByAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'appointment_history',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });
  return AppointmentHistory;
}; 