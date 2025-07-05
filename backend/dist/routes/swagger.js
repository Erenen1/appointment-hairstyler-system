"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = __importDefault(require("../config/env"));
const swagger_1 = require("../swagger");
const options = {
    definition: Object.assign(Object.assign({}, swagger_1.swaggerConfig), { servers: [
            {
                url: `${env_1.default.DOMAIN}`,
                description: 'Development Server'
            },
            {
                url: `${env_1.default.DOMAIN}`,
                description: 'Production Server'
            }
        ] }),
    apis: ['./routes/*.ts', '../swagger/**/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map