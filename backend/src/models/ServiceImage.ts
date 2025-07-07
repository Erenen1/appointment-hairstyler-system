module.exports = (sequelize: any, DataTypes: any) => {
  const ServiceImage = sequelize.define('ServiceImage', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'service_id',
      references: {
        model: 'services',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    imagePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_path',
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_main',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'order_index',
    },
  }, {
    tableName: 'service_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return ServiceImage;
}; 