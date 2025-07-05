"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPaginationResponse = exports.getPaginationOptions = exports.handleControllerError = void 0;
const ApiError_1 = require("./ApiError");
const handleControllerError = (error, res, defaultMessage = 'Sunucu hatası') => {
    if (error instanceof ApiError_1.ApiError) {
        res.status(error.statusCode).json(error.toJSON());
    }
    else {
        res.status(500).json(ApiError_1.ApiError.internal(defaultMessage).toJSON());
    }
};
exports.handleControllerError = handleControllerError;
const getPaginationOptions = (page, limit) => {
    const offset = (page - 1) * limit;
    return {
        offset,
        limit
    };
};
exports.getPaginationOptions = getPaginationOptions;
const formatPaginationResponse = (totalItems, currentPage, itemsPerPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};
exports.formatPaginationResponse = formatPaginationResponse;
//# sourceMappingURL=controllerUtils.js.map