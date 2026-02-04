// Authentication Types
export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterUserCommand {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenCommand {
  token: string;
  refreshToken: string;
}

export interface UpdateAccountCommand {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface LoginCommandResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterUserCommandResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdDate: string;
  lastModifiedDate?: string;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCommand) => Promise<void>;
  register: (userData: RegisterUserCommand) => Promise<void>;
  logout: () => void;
  refreshTokenFn: () => Promise<void>;
  updateProfile: (data: UpdateAccountCommand) => Promise<void>;
  clearError: () => void;
}
