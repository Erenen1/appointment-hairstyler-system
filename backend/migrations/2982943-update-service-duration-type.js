module.exports = {
  async up(queryInterface, Sequelize) {
    // Önce mevcut duration verilerini backup alalım
    await queryInterface.addColumn('services', 'duration_backup', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.sequelize.query(`
      UPDATE services 
      SET duration_backup = duration
    `);

    // Duration alanını INTEGER olarak değiştirelim
    await queryInterface.changeColumn('services', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes (e.g., 45)'
    });

    // Mevcut string verilerini integer'a çevirelim
    // "45 dakika" -> 45, "1 saat" -> 60 gibi
    await queryInterface.sequelize.query(`
      UPDATE services 
      SET duration = CASE 
        WHEN duration_backup LIKE '%saat%' THEN 
          CAST(REGEXP_REPLACE(duration_backup, '[^0-9]', '', 'g') AS INTEGER) * 60
        WHEN duration_backup LIKE '%dakika%' THEN 
          CAST(REGEXP_REPLACE(duration_backup, '[^0-9]', '', 'g') AS INTEGER)
        ELSE 30
      END
      WHERE duration_backup IS NOT NULL
    `);

    // Backup alanını silelim
    await queryInterface.removeColumn('services', 'duration_backup');
  },

  async down(queryInterface, Sequelize) {
    // Geri alma: INTEGER'dan STRING'e çevir
    await queryInterface.changeColumn('services', 'duration', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Duration as string (e.g., "45 dakika")'
    });

    // Integer değerleri string'e çevir
    await queryInterface.sequelize.query(`
      UPDATE services 
      SET duration = CONCAT(duration, ' dakika')
      WHERE duration IS NOT NULL
    `);
  }
}; 