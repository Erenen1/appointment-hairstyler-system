module.exports = (sequelize: any, DataTypes: any) => {
  const BusinessHours = sequelize.define('BusinessHours', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    dayOfWeek: {
      type: DataTypes.SMALLINT,
      comment: '1 = Pazartesi, 7 = Pazar',
    },
    openTime: {
      type: DataTypes.TIME,
    },
    closeTime: {
      type: DataTypes.TIME,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'business_hours',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return BusinessHours;
}; 