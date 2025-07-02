module.exports = (sequelize: any, DataTypes: any) => {
  const ServiceImage = sequelize.define('ServiceImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'service_images',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });

  return ServiceImage;
}; 