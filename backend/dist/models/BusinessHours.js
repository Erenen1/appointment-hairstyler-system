module.exports = (sequelize, DataTypes) => {
    const BusinessHours = sequelize.define('BusinessHours', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dayOfWeek: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            unique: true,
            comment: '1 = Pazartesi, 7 = Pazar',
        },
        openTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        closeTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: 'business_hours',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return BusinessHours;
};
//# sourceMappingURL=BusinessHours.js.map