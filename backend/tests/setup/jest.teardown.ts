import { TestDatabase } from './testDatabase';

module.exports = async () => {
  try {
    // Database connection'ları kapat
    await TestDatabase.forceClose();
    
    // Timeout ekle ki bağlantılar kapansın
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🧹 Global test teardown completed');
  } catch (error) {
    console.error('❌ Error during global teardown:', error);
  }
}; 