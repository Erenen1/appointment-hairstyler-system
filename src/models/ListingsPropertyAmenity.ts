module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsPropertyAmenity = sequelize.define('ListingsPropertyAmenity', {
    property_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    amenity_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
  }, {
    tableName: 'property_amenities',
    schema: 'listings',
    timestamps: false,
  });

  return ListingsPropertyAmenity;
};


