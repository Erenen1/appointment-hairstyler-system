import { teardownTestDatabase } from './testDatabase';

module.exports = async () => {
  await teardownTestDatabase();
}; 