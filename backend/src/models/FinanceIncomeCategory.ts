module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceIncomeCategory = sequelize.define('FinanceIncomeCategory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    color: { type: DataTypes.TEXT },
  }, {
    tableName: 'income_categories',
    schema: 'finance',
    indexes: [ { unique: true, fields: ['tenant_id', 'name'] } ],
  });
  return FinanceIncomeCategory;
};


