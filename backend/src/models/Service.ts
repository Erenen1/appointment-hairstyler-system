module.exports = (sequelize: any, DataTypes: any) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.JSON,
      allowNull: true,
    },
    includes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    recommendedFor: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    beforeAfterImages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: 'services',
    timestamps: true,
  });
  return Service;
}; 
