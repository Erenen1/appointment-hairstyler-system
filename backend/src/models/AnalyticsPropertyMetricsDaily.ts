module.exports = (sequelize: any, DataTypes: any) => {
  const AnalyticsPropertyMetricsDaily = sequelize.define('AnalyticsPropertyMetricsDaily', {
    day: { type: DataTypes.DATEONLY, allowNull: false, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    property_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    views: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
    clicks: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
    favorites: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'property_metrics_daily',
    schema: 'analytics',
    timestamps: false,
  });
  return AnalyticsPropertyMetricsDaily;
};


