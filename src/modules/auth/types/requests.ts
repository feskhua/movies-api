export interface AuthRequestPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user: AuthRequestPayload;
}
