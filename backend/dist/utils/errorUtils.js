"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.getErrorDetails = exports.getErrorMessage = void 0;
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    return 'Bilinmeyen hata';
};
exports.getErrorMessage = getErrorMessage;
const getErrorDetails = (error) => {
    if (error instanceof Error) {
        return {
            message: error.message,
            name: error.name,
            stack: error.stack
        };
    }
    return {
        message: (0, exports.getErrorMessage)(error)
    };
};
exports.getErrorDetails = getErrorDetails;
const isError = (error) => {
    return error instanceof Error;
};
exports.isError = isError;
//# sourceMappingURL=errorUtils.js.map