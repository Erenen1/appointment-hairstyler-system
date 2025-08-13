module.exports = (sequelize: any, DataTypes: any) => {
  const SettingsNotificationSettings = sequelize.define('SettingsNotificationSettings', {
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sms_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    appointment_reminders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    new_customer_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    payment_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'notification_settings',
    schema: 'settings',
    timestamps: false,
  });

  return SettingsNotificationSettings;
};


