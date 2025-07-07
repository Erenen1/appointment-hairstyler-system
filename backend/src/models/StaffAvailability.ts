module.exports = (sequelize: any, DataTypes: any) => {
  const StaffAvailability = sequelize.define('StaffAvailability', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Müsaitlik tarihi (YYYY-MM-DD)'
    },
    dayOfWeek: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: '1 = Pazartesi, 7 = Pazar',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Çalışma başlangıç saati'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Çalışma bitiş saati'
    },
    lunchBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Öğle molası başlangıç saati'
    },
    lunchBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Öğle molası bitiş saati'
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Personel bu tarihte müsait mi?'
    },
    type: {
      type: DataTypes.ENUM('default', 'custom', 'off'),
      allowNull: false,
      defaultValue: 'default',
      comment: 'default: iş saatleri, custom: özel saat, off: izinli'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Özel notlar (izin sebebi, özel durum açıklaması)'
    }
  }, {
    tableName: 'staff_availability',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['staffId', 'date']
      },
      {
        fields: ['date']
      },
      {
        fields: ['staffId']
      },
      {
        fields: ['dayOfWeek']
      }
    ]
  });

  return StaffAvailability;
}; 