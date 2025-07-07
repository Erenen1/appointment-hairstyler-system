module.exports = (sequelize, DataTypes) => {
    const AppointmentHistory = sequelize.define('AppointmentHistory', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        appointmentId: {
            type: DataTypes.UUID,
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
        createdAt: 'created_at',
        updatedAt: false,
    });
    return AppointmentHistory;
};
//# sourceMappingURL=AppointmentHistory.js.map