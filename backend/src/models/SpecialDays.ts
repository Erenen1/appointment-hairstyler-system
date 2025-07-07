module.exports = (sequelize: any, DataTypes: any) => {
  const SpecialDays = sequelize.define('SpecialDays', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return SpecialDays;
}; 