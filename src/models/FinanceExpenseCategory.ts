module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceExpenseCategory = sequelize.define('FinanceExpenseCategory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    color: { type: DataTypes.TEXT },
    budget: { type: DataTypes.DECIMAL(14,2) },
  }, {
    tableName: 'expense_categories',
    schema: 'finance',
    indexes: [ { unique: true, fields: ['tenant_id', 'name'] } ],
  });
  return FinanceExpenseCategory;
};


