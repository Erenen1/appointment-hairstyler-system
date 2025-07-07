module.exports = (sequelize: any, DataTypes: any) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'service_categories',
        key: 'id',
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Duration as string (e.g., "45 dakika")'
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Price as string (e.g., "250 TL")'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    benefits: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    includes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    recommendedFor: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    beforeAfterImages: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  }, {
    tableName: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Service;
}; 
