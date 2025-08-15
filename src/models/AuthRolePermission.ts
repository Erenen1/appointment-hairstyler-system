module.exports = (sequelize: any, DataTypes: any) => {
  const AuthRolePermission = sequelize.define('AuthRolePermission', {
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'role_permissions',
    schema: 'auth',
    timestamps: false,
  });

  return AuthRolePermission;
};


