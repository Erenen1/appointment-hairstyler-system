export class ApiSuccess<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  public timestamp: string;
  constructor(
    message: string = 'İşlem başarılı',
    data?: T,
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    }
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
    this.timestamp = new Date().toISOString();
  }
  static item<T>(data: T, message: string = 'Kayıt başarıyla getirildi'): ApiSuccess<T> {
    return new ApiSuccess(message, data);
  }
  static list<T>(
    data: T[],
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    },
    message: string = 'Kayıtlar başarıyla getirildi'
  ): ApiSuccess<T[]> {
    return new ApiSuccess(message, data, pagination);
  }
  static created<T>(data: T, message: string = 'Kayıt başarıyla oluşturuldu'): ApiSuccess<T> {
    return new ApiSuccess(message, data);
  }
  static updated<T>(data: T, message: string = 'Kayıt başarıyla güncellendi'): ApiSuccess<T> {
    return new ApiSuccess(message, data);
  }
  static deleted(message: string = 'Kayıt başarıyla silindi'): ApiSuccess<null> {
    return new ApiSuccess(message, null);
  }
  static message(message: string): ApiSuccess<null> {
    return new ApiSuccess(message, null);
  }
} 

