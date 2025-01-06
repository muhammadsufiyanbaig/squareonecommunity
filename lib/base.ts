import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Brand, Deal, Ad } from ".";

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
  removeDeal: (dealId: string) => void;
  updateDeal: (brandId: string, updatedDeal: Deal) => void;
  addDeal: (brandId: string, newDeal: Deal) => void;
}

const useBrandStore = create<BrandState>()(
  devtools(
    persist(
      (set) => ({
        brands: [],
        setBrands: (brands: Brand[]) => set((state) => ({ ...state, brands })),
        removeDeal: (dealId: string) =>
          set((state) => ({
            brands: state.brands.map((brand) => ({
              ...brand,
              deals: Array.isArray(brand.deals)
                ? brand.deals.filter((deal) => deal.dealid !== dealId)
                : brand.deals,
            })),
          })),
        updateDeal: (brandId: string, updatedDeal: Deal) =>
          set((state) => ({
            brands: state.brands.map((brand) => {
              if (brand.brandid === brandId) {
                const updatedDeals = Array.isArray(brand.deals)
                  ? brand.deals.map((deal) =>
                      deal.dealid === updatedDeal.dealid ? updatedDeal : deal
                    )
                  : brand.deals;
                return { ...brand, deals: updatedDeals };
              }
              return brand;
            }),
          })),
        addDeal: (brandId: string, newDeal: Deal) =>
          set((state) => ({
            brands: state.brands.map((brand) => {
              if (brand.brandid === brandId) {
                const updatedDeals = Array.isArray(brand.deals)
                  ? [...brand.deals, newDeal]
                  : [newDeal];
                return { ...brand, deals: updatedDeals };
              }
              return brand;
            }),
          })),
      }),
      {
        name: "brand-storage",
      }
    )
  )
);

interface AdState {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  removeAd: (adId: string) => void;
  getAdById: (adId: string) => Ad | undefined; 
}

const useAdStore = create<AdState>()(
  devtools(
    persist(
      (set, get) => ({
        ads: [],
        setAds: (ads: Ad[]) => set((state) => ({ ...state, ads })),
        removeAd: (adId: string) =>
          set((state) => ({
            ads: state.ads.filter((ad) => ad.id !== adId),
          })),
        getAdById: (adId: string) => get().ads.find((ad) => ad.id === adId), // Add this method
      }),
      {
        name: "ad-storage",
      }
    )
  )
);

export default useAuthStore;
export { useBrandStore, useAdStore };
