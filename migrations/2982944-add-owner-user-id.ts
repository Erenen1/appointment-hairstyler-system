const addOwnerUserId = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Listings
    await queryInterface.addColumn({ tableName: 'properties', schema: 'listings' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // CRM
    await queryInterface.addColumn({ tableName: 'customers', schema: 'crm' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Finance
    await queryInterface.addColumn({ tableName: 'incomes', schema: 'finance' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
    await queryInterface.addColumn({ tableName: 'expenses', schema: 'finance' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
    await queryInterface.addColumn({ tableName: 'current_accounts', schema: 'finance' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Schedule
    await queryInterface.addColumn({ tableName: 'appointments', schema: 'schedule' }, 'owner_user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface: any, _Sequelize: any) => {
    await queryInterface.removeColumn({ tableName: 'properties', schema: 'listings' }, 'owner_user_id');
    await queryInterface.removeColumn({ tableName: 'customers', schema: 'crm' }, 'owner_user_id');
    await queryInterface.removeColumn({ tableName: 'incomes', schema: 'finance' }, 'owner_user_id');
    await queryInterface.removeColumn({ tableName: 'expenses', schema: 'finance' }, 'owner_user_id');
    await queryInterface.removeColumn({ tableName: 'current_accounts', schema: 'finance' }, 'owner_user_id');
    await queryInterface.removeColumn({ tableName: 'appointments', schema: 'schedule' }, 'owner_user_id');
  }
};

export default addOwnerUserId;


