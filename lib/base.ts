import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Brand } from ".";

interface AuthState {
  id: string;
  email: string;
  fullname: string;
  setAdminId: (id: string) => void;
  setAdminEmail: (email: string) => void;
  setFullname: (fullname: string) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        email: "",
        fullname: "",
        setAdminId: (id: string) => set((state) => ({ ...state, id })),
        setAdminEmail: (email: string) => set((state) => ({ ...state, email })),
        setFullname: (fullname: string) =>
          set((state) => ({ ...state, fullname })),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);

interface BrandState {
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
}

const useBrandStore = create<BrandState>()(
  devtools(
    persist(
      (set) => ({
        brands: [],
        setBrands: (brands: Brand[]) => set((state) => ({ ...state, brands })),
      }),
      {
        name: "brand-storage",
      }
    )
  )
);

export default useAuthStore;
export { useBrandStore };
