module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsAmenity = sequelize.define('ListingsAmenity', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.TEXT },
  }, {
    tableName: 'amenities',
    schema: 'listings',
    indexes: [ { unique: true, fields: ['tenant_id', 'name'] } ],
  });

  return ListingsAmenity;
};


