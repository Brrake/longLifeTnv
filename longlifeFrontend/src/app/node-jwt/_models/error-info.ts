//Classe dedicata alla costruzione di errori personalizzati
export class ErrorInfo {
  message: string;
  success: boolean;

  constructor(message: string, success: boolean) {
    this.message = message;
    this.success = success;
  }
}
