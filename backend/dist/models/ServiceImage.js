module.exports = (sequelize, DataTypes) => {
    const ServiceImage = sequelize.define('ServiceImage', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        serviceId: {
            type: DataTypes.UUID,
            field: 'service_id',
            references: {
                model: 'services',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        imagePath: {
            type: DataTypes.STRING(255),
            field: 'image_path',
        },
        isMain: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_main',
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'order_index',
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
        tableName: 'service_images',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
    });
    return ServiceImage;
};
//# sourceMappingURL=ServiceImage.js.map