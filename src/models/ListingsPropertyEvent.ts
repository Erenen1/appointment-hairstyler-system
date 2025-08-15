module.exports = (sequelize: any, DataTypes: any) => {
  const ListingsPropertyEvent = sequelize.define('ListingsPropertyEvent', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    owner_user_id: { type: DataTypes.UUID, allowNull: false },
    property_id: { type: DataTypes.UUID, allowNull: false },
    customer_id: { type: DataTypes.UUID },
    event_type: { type: DataTypes.TEXT, allowNull: false },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    occurred_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'property_events',
    schema: 'listings',
    timestamps: false,
  });
  return ListingsPropertyEvent;
};


