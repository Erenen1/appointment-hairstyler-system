module.exports = (sequelize: any, DataTypes: any) => {
  const SpecialDays = sequelize.define('SpecialDays', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  }, {
    tableName: 'special_days',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  return SpecialDays;
}; 