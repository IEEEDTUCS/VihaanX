export class ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;

  constructor(data: T, message?: string, success = true) {
    this.success = success;
    this.data = data;
    if (message !== undefined) {
      this.message = message;
    }
  }
}
