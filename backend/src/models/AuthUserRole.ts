module.exports = (sequelize: any, DataTypes: any) => {
  const AuthUserRole = sequelize.define('AuthUserRole', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'user_roles',
    schema: 'auth',
    timestamps: false,
  });

  return AuthUserRole;
};


