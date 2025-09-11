export interface IGetProfile extends User {
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "superadmin";
}
