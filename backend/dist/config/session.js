"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const express_session_1 = __importDefault(require("express-session"));
const env_1 = __importDefault(require("./env"));
exports.sessionConfig = (0, express_session_1.default)({
    secret: env_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        partitioned: false,
    },
    name: 'sessionid',
    rolling: true
});
//# sourceMappingURL=session.js.map