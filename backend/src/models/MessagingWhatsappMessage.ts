module.exports = (sequelize: any, DataTypes: any) => {
  const MessagingWhatsappMessage = sequelize.define('MessagingWhatsappMessage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    sender: { type: DataTypes.TEXT, allowNull: false },
    message_type: { type: DataTypes.ENUM('text','image','document','unknown'), allowNull: false },
    content: { type: DataTypes.TEXT },
    caption: { type: DataTypes.TEXT },
    media_url: { type: DataTypes.TEXT },
    file_name: { type: DataTypes.TEXT },
    from_me: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.ENUM('sent','delivered','read','server_ack') },
    message_timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    remote_jid: { type: DataTypes.TEXT },
    external_id: { type: DataTypes.TEXT },
    raw_payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    processed_at: { type: DataTypes.DATE },
  }, {
    tableName: 'whatsapp_messages',
    schema: 'messaging',
    indexes: [ { unique: true, fields: ['tenant_id', 'external_id'] } ],
  });
  return MessagingWhatsappMessage;
};


