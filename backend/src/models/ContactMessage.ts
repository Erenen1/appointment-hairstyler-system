module.exports = (sequelize: any, DataTypes: any) => {
  const ContactMessage = sequelize.define('ContactMessage', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    subject: {
      type: DataTypes.STRING(255),
    },
    message: {
      type: DataTypes.TEXT,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'contact_messages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return ContactMessage;
}; 