module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        specialties: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        tableName: 'staff',
        paranoid: true,
    });
    return Staff;
};
//# sourceMappingURL=Staff.js.map