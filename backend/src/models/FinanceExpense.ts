module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceExpense = sequelize.define('FinanceExpense', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    category_id: { type: DataTypes.UUID },
    amount: { type: DataTypes.DECIMAL(14,2), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.TEXT },
    payment_method: { type: DataTypes.TEXT },
    type: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'expenses',
    schema: 'finance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return FinanceExpense;
};


