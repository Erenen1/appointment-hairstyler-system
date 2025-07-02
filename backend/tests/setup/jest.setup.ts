import { TestDatabase } from './testDatabase';
import { TestEnvironment } from './testEnvironment';

beforeAll(async () => {
  // Test ortamı değişkenlerini ayarla
  TestEnvironment.setup();
  
  // Test veritabanını başlat
  await TestDatabase.initialize();
  
  console.log('🧪 Test environment initialized successfully');
}, 60000);

beforeEach(async () => {
  // Her test öncesi database'i temizle
  await TestDatabase.clean();
});

afterAll(async () => {
  // Test sonrası temizlik
  await TestDatabase.close();
  console.log('🧹 Test environment cleaned up');
}, 30000); 