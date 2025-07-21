module.exports = (sequelize: any, DataTypes: any) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'İşletme adı'
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'İşletme sahibinin adı'
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: 'Giriş email adresi'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hashlenmiş şifre'
    },
    phone: {
      type: DataTypes.STRING,
      comment: 'İşletme telefonu'
    },
    address: {
      type: DataTypes.TEXT,
      comment: 'İşletme adresi'
    },
    logo: {
      type: DataTypes.STRING,
      comment: 'Logo dosya yolu'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'İşletme aktif mi?'
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'İşletme ayarları (çalışma saatleri, tema vb.)'
    },
    lastLogin: {
      type: DataTypes.DATE,
      comment: 'Son giriş tarihi'
    }
  }, {
    tableName: 'businesses',
    timestamps: true,
    paranoid: true, // soft delete için deletedAt
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    indexes: [
      {
        fields: ['email'],
        unique: true
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['businessName']
      }
    ]
  });

  return Business;
}; 