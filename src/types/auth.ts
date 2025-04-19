
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<string>;
  verifyCode: (email: string, code: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "user") => Promise<void>;
  logout: () => void;
}
