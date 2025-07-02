module.exports = (sequelize: any, DataTypes: any) => {
  const AppointmentStatus = sequelize.define('AppointmentStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'HEX veya RGB değeri',
    },
  }, {
    tableName: 'appointment_statuses',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });

  return AppointmentStatus;
}; 