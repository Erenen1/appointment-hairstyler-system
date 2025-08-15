module.exports = (sequelize: any, DataTypes: any) => {
  const MessagingWhatsappBotConfig = sequelize.define('MessagingWhatsappBotConfig', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    instance_id: { type: DataTypes.TEXT, allowNull: false },
    instance_name: { type: DataTypes.TEXT },
    phone_number: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    webhook_url: { type: DataTypes.TEXT },
    last_activity: { type: DataTypes.DATE },
  }, {
    tableName: 'whatsapp_bot_configs',
    schema: 'messaging',
    indexes: [ { unique: true, fields: ['tenant_id', 'instance_id'] } ],
  });
  return MessagingWhatsappBotConfig;
};


