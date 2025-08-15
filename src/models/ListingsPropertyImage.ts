module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsPropertyImage = sequelize.define('ListingsPropertyImage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    property_id: { type: DataTypes.UUID, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    alt: { type: DataTypes.TEXT },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'property_images',
    schema: 'listings',
    timestamps: false,
  });

  return ListingsPropertyImage;
};


