module.exports = (sequelize, DataTypes) => {
    const StaffService = sequelize.define('StaffService', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        staffId: {
            type: DataTypes.UUID,
            field: 'staff_id',
            references: {
                model: 'staff',
                key: 'id',
            },
        },
        serviceId: {
            type: DataTypes.UUID,
            field: 'service_id',
            references: {
                model: 'services',
                key: 'id',
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Bu personelin bu hizmeti verebilir durumda olup olmadığı'
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
        tableName: 'staff_services',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
        indexes: [
            {
                fields: ['staff_id', 'service_id']
            }
        ]
    });
    return StaffService;
};
//# sourceMappingURL=StaffService.js.map