module.exports = (sequelize, DataTypes) => {
    const StaffAvailability = sequelize.define('StaffAvailability', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        staffId: {
            type: DataTypes.UUID,
            references: {
                model: 'staff',
                key: 'id',
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            comment: 'Müsaitlik tarihi (YYYY-MM-DD)'
        },
        dayOfWeek: {
            type: DataTypes.SMALLINT,
            comment: '1 = Pazartesi, 7 = Pazar',
        },
        startTime: {
            type: DataTypes.TIME,
            comment: 'Çalışma başlangıç saati'
        },
        endTime: {
            type: DataTypes.TIME,
            comment: 'Çalışma bitiş saati'
        },
        lunchBreakStart: {
            type: DataTypes.TIME,
            comment: 'Öğle molası başlangıç saati'
        },
        lunchBreakEnd: {
            type: DataTypes.TIME,
            comment: 'Öğle molası bitiş saati'
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Personel bu tarihte müsait mi?'
        },
        type: {
            type: DataTypes.ENUM('default', 'custom', 'off'),
            defaultValue: 'default',
            comment: 'default: iş saatleri, custom: özel saat, off: izinli'
        },
        notes: {
            type: DataTypes.TEXT,
            comment: 'Özel notlar (izin sebebi, özel durum açıklaması)'
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
        }
    }, {
        tableName: 'staff_availability',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
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
//# sourceMappingURL=StaffAvailability.js.map