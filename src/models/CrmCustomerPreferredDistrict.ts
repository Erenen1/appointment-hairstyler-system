module.exports = (sequelize: any, DataTypes: any) => {
  const CrmCustomerPreferredDistrict = sequelize.define('CrmCustomerPreferredDistrict', {
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    district_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    city_name: {
      type: DataTypes.TEXT,
    },
    district_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'customer_preferred_districts',
    schema: 'crm',
    timestamps: false,
  });

  return CrmCustomerPreferredDistrict;
};


