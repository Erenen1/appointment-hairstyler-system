module.exports = (sequelize: any, DataTypes: any) => {
  const StaffService = sequelize.define('StaffService', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'staff_id',
      references: {
        model: 'staff',
        key: 'id',
      },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'service_id',
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
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['staff_id', 'service_id']
      }
    ]
  });

  return StaffService;
}; 