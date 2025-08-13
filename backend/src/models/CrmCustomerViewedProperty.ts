module.exports = (sequelize: any, DataTypes: any) => {
  const CrmCustomerViewedProperty = sequelize.define('CrmCustomerViewedProperty', {
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    first_viewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_viewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    views_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'customer_viewed_properties',
    schema: 'crm',
    timestamps: false,
  });

  return CrmCustomerViewedProperty;
};


