module.exports = (sequelize, DataTypes) => {
    const AppointmentHistory = sequelize.define('AppointmentHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        appointmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'appointments',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdByAdmin: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    }, {
        tableName: 'appointment_history',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
    });
    return AppointmentHistory;
};
//# sourceMappingURL=AppointmentHistory.js.map