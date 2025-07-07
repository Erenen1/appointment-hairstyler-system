module.exports = (sequelize, DataTypes) => {
    const ServiceCategory = sequelize.define('ServiceCategory', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imagePath: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'service_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return ServiceCategory;
};
//# sourceMappingURL=ServiceCategory.js.map