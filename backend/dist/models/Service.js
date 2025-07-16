module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        categoryId: {
            type: DataTypes.UUID,
            field: 'category_id',
            references: {
                model: 'service_categories',
                key: 'id',
            },
        },
        slug: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        duration: {
            type: DataTypes.STRING,
            comment: 'Duration as string (e.g., "45 dakika")'
        },
        price: {
            type: DataTypes.STRING,
            comment: 'Price as string (e.g., "250 TL")'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        benefits: {
            type: DataTypes.JSONB,
        },
        includes: {
            type: DataTypes.JSONB,
        },
        recommendedFor: {
            type: DataTypes.JSONB,
        },
        beforeAfterImages: {
            type: DataTypes.JSONB,
        }
    }, {
        tableName: 'services',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return Service;
};
//# sourceMappingURL=Service.js.map