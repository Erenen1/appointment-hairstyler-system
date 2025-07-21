module.exports = (sequelize, DataTypes) => {
    const GalleryCategory = sequelize.define('GalleryCategory', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(100),
        },
        description: {
            type: DataTypes.TEXT,
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: 'gallery_categories',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return GalleryCategory;
};
//# sourceMappingURL=GalleryCategory.js.map