export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details: any = {},
  ) {
    super(message);
  }
}
