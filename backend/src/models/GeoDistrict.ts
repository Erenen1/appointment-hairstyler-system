module.exports = (sequelize: any, DataTypes: any) => {
  const GeoDistrict = sequelize.define('GeoDistrict', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'districts',
    schema: 'geo',
    indexes: [
      { unique: true, fields: ['city_id', 'name'] },
    ],
    timestamps: false,
  });

  return GeoDistrict;
};


