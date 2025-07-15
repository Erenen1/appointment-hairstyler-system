module.exports = (sequelize: any, DataTypes: any) => {
  const SpecialDays = sequelize.define('SpecialDays', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    openTime: {
      type: DataTypes.TIME,
    },
    closeTime: {
      type: DataTypes.TIME,
    },
  }, {
    tableName: 'special_days',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return SpecialDays;
}; 