module.exports = (sequelize, DataTypes) => {
    const ContactMessage = sequelize.define('ContactMessage', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: 'contact_messages',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return ContactMessage;
};
//# sourceMappingURL=ContactMessage.js.map