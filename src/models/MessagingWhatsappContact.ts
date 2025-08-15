module.exports = (sequelize: any, DataTypes: any) => {
  const MessagingWhatsappContact = sequelize.define('MessagingWhatsappContact', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenant_id: { type: DataTypes.UUID, allowNull: false },
    phone_number: { type: DataTypes.TEXT, allowNull: false },
    name: { type: DataTypes.TEXT },
    profile_image: { type: DataTypes.TEXT },
    last_message_id: { type: DataTypes.UUID },
  }, {
    tableName: 'whatsapp_contacts',
    schema: 'messaging',
    indexes: [ { unique: true, fields: ['tenant_id', 'phone_number'] } ],
  });
  return MessagingWhatsappContact;
};


