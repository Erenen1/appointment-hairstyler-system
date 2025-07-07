module.exports = (sequelize: any, DataTypes: any) => {
  const StaffService = sequelize.define('StaffService', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'id',
      },
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Bu personelin bu hizmeti verebilir durumda olup olmadığı'
    },
  }, {
    tableName: 'staff_services',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['staffId', 'serviceId']
      }
    ]
  });

  return StaffService;
}; 