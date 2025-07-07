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
const adminOptions = {
    definition: Object.assign(Object.assign({}, swagger_1.adminSwaggerConfig), { servers: [
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
const publicOptions = {
    definition: Object.assign(Object.assign({}, swagger_1.publicSwaggerConfig), { servers: [
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
const adminSwaggerSpec = (0, swagger_jsdoc_1.default)(adminOptions);
const publicSwaggerSpec = (0, swagger_jsdoc_1.default)(publicOptions);
const setupSwagger = (app) => {
    app.use('/api-docs/admin', swagger_ui_express_1.default.serve);
    app.get('/api-docs/admin', swagger_ui_express_1.default.setup(adminSwaggerSpec, {
        customSiteTitle: 'Admin API Documentation',
        customCss: '.swagger-ui .topbar { background-color: #dc3545; }',
        swaggerOptions: {
            docExpansion: 'list',
            defaultModelsExpandDepth: 1,
            defaultModelRendering: 'example'
        }
    }));
    app.use('/api-docs/public', swagger_ui_express_1.default.serve);
    app.get('/api-docs/public', swagger_ui_express_1.default.setup(publicSwaggerSpec, {
        customSiteTitle: 'Public API Documentation',
        customCss: '.swagger-ui .topbar { background-color: #28a745; }',
        swaggerOptions: {
            docExpansion: 'list',
            defaultModelsExpandDepth: 1,
            defaultModelRendering: 'example'
        }
    }));
    app.use('/api-docs', swagger_ui_express_1.default.serve);
    app.get('/api-docs', swagger_ui_express_1.default.setup(adminSwaggerSpec));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map