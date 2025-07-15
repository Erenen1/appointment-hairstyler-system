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
    }, {
        tableName: 'gallery_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return GalleryCategory;
};
//# sourceMappingURL=GalleryCategory.js.map