module.exports = (sequelize: any, DataTypes: any) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON formatında değişkenler',
    },
  }, {
    tableName: 'email_templates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return EmailTemplate;
}; 