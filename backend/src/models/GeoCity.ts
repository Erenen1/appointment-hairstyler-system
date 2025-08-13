module.exports = (sequelize: any, DataTypes: any) => {
  const GeoCity = sequelize.define('GeoCity', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'cities',
    schema: 'geo',
    timestamps: false,
  });

  return GeoCity;
};


