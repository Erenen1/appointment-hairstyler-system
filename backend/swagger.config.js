const { swaggerConfig } = require('./dist/swagger/index.js');

module.exports = {
  ...swaggerConfig,
  apis: ['./dist/**/*.js']
}; 