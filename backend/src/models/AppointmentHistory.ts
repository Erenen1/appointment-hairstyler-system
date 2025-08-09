module.exports = (sequelize: any, DataTypes: any) => {
  const AppointmentHistory = sequelize.define('AppointmentHistory', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    appointmentId: {
      type: DataTypes.UUID,
      references: {
        model: 'appointments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdByAdmin: {
      type: DataTypes.UUID,
      references: {
        model: 'admins',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'business_id',
      references: {
        model: 'businesses',
        key: 'id',
      },
      comment: 'İşletme ID (foreign key)'
    },
  }, {
    tableName: 'appointment_history',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });
  return AppointmentHistory;
}; 