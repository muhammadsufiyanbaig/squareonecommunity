import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  email: string;
  fullname: string;
  setAdminEmail: (email: string) => void;
  setFullname: (fullname: string) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        email: "",
        fullname: "",
        setAdminEmail: (email: string) => set(({ email })),  
        setFullname: (fullname: string) => set(({ fullname })),
      }),
      {
        name: "auth-storage", 
      }
    )
  )
);

export default useAuthStore;
