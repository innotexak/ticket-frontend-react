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
  accessToken: string;
  refreshToken: string;
}

export interface UpdateAccountCommand {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface LoginCommandResponse {
 data:{
   accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
 }

}

export interface ChangePasswordCommand {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordCommand {
  email: string;
}

export interface ResetPasswordCommand {
  token: string;
  newPassword: string;
}

export interface RegisterUserCommandResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  createdDate: string;
  lastModifiedDate?: string;
  role?:string
  userName?:string
}

export interface BaseResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
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
  changePassword: (data: ChangePasswordCommand) => Promise<void>;
  forgotPassword: (data: ForgotPasswordCommand) => Promise<void>;
  resetPassword: (data: ResetPasswordCommand) => Promise<void>;
  clearError: () => void;
}
