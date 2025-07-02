module.exports = (sequelize: any, DataTypes: any) => {
  const StaffService = sequelize.define('StaffService', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'staff_services',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['staffId', 'serviceId']
      }
    ]
  });
  return StaffService;
}; 