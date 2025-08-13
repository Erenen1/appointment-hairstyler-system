module.exports = (sequelize: any, DataTypes: any) => {
  const FinanceCurrentAccount = sequelize.define('FinanceCurrentAccount', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    customer_id: { type: DataTypes.UUID },
    name: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    balance: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
    last_transaction_at: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('active','paid','overdue','cancelled'), allowNull: false, defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'current_accounts',
    schema: 'finance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return FinanceCurrentAccount;
};


