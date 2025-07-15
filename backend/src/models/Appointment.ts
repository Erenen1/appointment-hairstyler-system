module.exports = (sequelize: any, DataTypes: any) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'customers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    staffId: {
      type: DataTypes.UUID,
      references: {
        model: 'staff',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    serviceId: {
      type: DataTypes.UUID,
      references: {
        model: 'services',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Randevu sırasındaki hizmet fiyatı (sabit)',
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
  }, {
    tableName: 'appointments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return Appointment;
}; 