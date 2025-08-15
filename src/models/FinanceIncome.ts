module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceIncome = sequelize.define('FinanceIncome', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    category_id: { type: DataTypes.UUID },
    amount: { type: DataTypes.DECIMAL(14,2), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.TEXT },
    payment_method: { type: DataTypes.TEXT },
    source: { type: DataTypes.TEXT },
    owner_user_id: { type: DataTypes.UUID },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'incomes',
    schema: 'finance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [ { fields: ['owner_user_id'] } ],
  });
  return FinanceIncome;
};


