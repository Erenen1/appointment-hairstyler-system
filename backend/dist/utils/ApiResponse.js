"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSuccess = void 0;
class ApiSuccess {
    constructor(message = 'İşlem başarılı', data, pagination) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
        this.timestamp = new Date().toISOString();
    }
    static item(data, message = 'Kayıt başarıyla getirildi') {
        return new ApiSuccess(message, data);
    }
    static list(data, pagination, message = 'Kayıtlar başarıyla getirildi') {
        return new ApiSuccess(message, data, pagination);
    }
    static created(data, message = 'Kayıt başarıyla oluşturuldu') {
        return new ApiSuccess(message, data);
    }
    static updated(data, message = 'Kayıt başarıyla güncellendi') {
        return new ApiSuccess(message, data);
    }
    static deleted(message = 'Kayıt başarıyla silindi') {
        return new ApiSuccess(message, null);
    }
    static message(message) {
        return new ApiSuccess(message, null);
    }
}
exports.ApiSuccess = ApiSuccess;
//# sourceMappingURL=ApiResponse.js.map