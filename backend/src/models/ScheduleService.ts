module.exports = (sequelize: any, DataTypes: any) => {
  const ScheduleService = sequelize.define('ScheduleService', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(14,2) },
    duration_mins: { type: DataTypes.SMALLINT },
  }, {
    tableName: 'services',
    schema: 'schedule',
    indexes: [ { unique: true, fields: ['tenant_id', 'title'] } ],
  });
  return ScheduleService;
};


