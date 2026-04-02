declare global {
  namespace Express {
    export interface Request {
      customProperty?: string;
    }
  }
}
// This empty export makes the file a module, allowing declare global to work properly
export {};
