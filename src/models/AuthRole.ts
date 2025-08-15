module.exports = (sequelize: any, DataTypes: any) => {
  const AuthRole = sequelize.define('AuthRole', {
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
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'roles',
    schema: 'auth',
    indexes: [
      { unique: true, fields: ['tenant_id', 'name'] },
    ],
  });

  return AuthRole;
};


