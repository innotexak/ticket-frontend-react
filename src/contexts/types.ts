import { UserProfile } from "@/types/auth";

// Action types
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: UserProfile; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: UserProfile }
  | { type: 'CHANGE_PASSWORD_SUCCESS' }
  | { type: 'FORGOT_PASSWORD_SUCCESS' }
  | {type:'RESET_PASSWORD_SUCCESS'}
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };
