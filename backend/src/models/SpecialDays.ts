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
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'business_id',
      references: {
        model: 'businesses',
        key: 'id',
      },
      comment: 'İşletme ID (foreign key)'
    },
  }, {
    tableName: 'special_days',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return SpecialDays;
}; 