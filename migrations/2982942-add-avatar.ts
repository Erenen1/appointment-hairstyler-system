const addAvatar = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Staff', 'specialties', {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Genel Hizmetler' // Mevcut kayıtlar için default
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Staff', 'specialties');
    }
  };

export default addAvatar;