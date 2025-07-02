module.exports = (sequelize: any, DataTypes: any) => {
  const SmsTemplate = sequelize.define('SmsTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON formatında değişkenler',
    },
  }, {
    tableName: 'sms_templates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return SmsTemplate;
}; 