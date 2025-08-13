module.exports = (sequelize: any, DataTypes: any) => {
  const CrmCustomerRequirement = sequelize.define('CrmCustomerRequirement', {
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    requirement_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'customer_requirements',
    schema: 'crm',
    timestamps: false,
  });

  return CrmCustomerRequirement;
};


