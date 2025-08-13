module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsPropertyTag = sequelize.define('ListingsPropertyTag', {
    property_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    tag_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
  }, {
    tableName: 'property_tags',
    schema: 'listings',
    timestamps: false,
  });
  return ListingsPropertyTag;
};


