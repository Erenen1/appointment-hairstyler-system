module.exports = (sequelize: any, DataTypes: any) => {
  const GalleryImage = sequelize.define('GalleryImage', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'gallery_categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    imagePath: {
      type: DataTypes.STRING(255),
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'gallery_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return GalleryImage;
}; 