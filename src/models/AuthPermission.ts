module.exports = (sequelize: any, DataTypes: any) => {
  const AuthPermission = sequelize.define('AuthPermission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'permissions',
    schema: 'auth',
  });

  return AuthPermission;
};


