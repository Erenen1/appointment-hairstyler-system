module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceCurrentAccountTransaction = sequelize.define('FinanceCurrentAccountTransaction', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    account_id: { type: DataTypes.UUID, allowNull: false },
    tx_type: { type: DataTypes.ENUM('payment','charge','adjustment'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(14,2), allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    reference: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
  }, {
    tableName: 'current_account_transactions',
    schema: 'finance',
    timestamps: false,
  });
  return FinanceCurrentAccountTransaction;
};


