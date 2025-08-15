module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsTag = sequelize.define('ListingsTag', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    owner_user_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
  }, {
    tableName: 'tags',
    schema: 'listings',
    indexes: [ { unique: true, fields: ['owner_user_id', 'name'] } ],
  });
  return ListingsTag;
};


