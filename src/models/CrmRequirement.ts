module.exports = (sequelize: any, DataTypes: any) => {
  const CrmRequirement = sequelize.define('CrmRequirement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'requirements',
    schema: 'crm',
    indexes: [
      { unique: true, fields: ['tenant_id', 'name'] },
    ],
  });

  return CrmRequirement;
};


