module.exports = (sequelize: any, DataTypes: any) => {
    const CustomerBusiness = sequelize.define('CustomerBusiness', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        customerId: {
            type: DataTypes.STRING,
            field: 'customer_id',
            referances: {
                model: 'customers',
                key: 'id',
            },
            comment: 'Müşteri ID (foreign key)'
        },
        businessId: {
            type: DataTypes.UUID,
            field: 'business_id',
            references: {
                model: 'businesses',
                key: 'id',
            },
            comment: 'İşletme ID (foreign key)'
        },
    }, {
        tableName: 'customers',
        paranoid: true,
    });

    return CustomerBusiness;
}; 