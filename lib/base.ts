import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Brand, Deal, Ad, Events } from ".";

interface User {
  id: number;
  whatsappno: string;
  fullname: string;
  dateofbirth: string;
  location: string;
  gender: "Male" | "Female" | "Other";
  lastlogin: string;
  profileImage: string;
  createdat: string;
}
interface AuthState {
  id: string;
  email: string;
  fullname: string;
  users: User[];
  setAdminId: (id: string) => void;
  setAdminEmail: (email: string) => void;
  setFullname: (fullname: string) => void;
  setUsers: (users: User[]) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        email: "",
        fullname: "",
        users: [],
        setAdminId: (id: string) => set((state) => ({ ...state, id })),
        setAdminEmail: (email: string) => set((state) => ({ ...state, email })),
        setFullname: (fullname: string) =>
          set((state) => ({ ...state, fullname })),
        setUsers: (users: User[]) => set((state) => ({ ...state, users })),
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
  getAllDeals: () => Deal[];
  updateBrand: (brandId: string, updatedData: Partial<Brand>) => void;
  addBrand: (newBrand: Brand) => void;
}

const useBrandStore = create<BrandState>()(
  devtools(
    persist(
      (set, get) => ({
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
                  : [updatedDeal];
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
        getAllDeals: () => {
          return get().brands.flatMap((brand) => brand.deals);
        },
        updateBrand: (brandId: string, updatedData: Partial<Brand>) =>
          set((state) => ({
            brands: state.brands.map((brand) =>
              brand.brandid === brandId ? { ...brand, ...updatedData } : brand
            ),
          })),
        addBrand: (newBrand: Brand) =>
          set((state) => ({ brands: [...state.brands, newBrand] })),
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
        getAdById: (adId: string) => get().ads.find((ad) => ad.id === adId),
      }),
      {
        name: "ad-storage",
      }
    )
  )
);

interface EventState {
  events: Events[];
  setEvents: (events: Events[]) => void;
  updateEvent: (updatedEvent: Events) => void;
  getEventById: (eventId: string) => Events | undefined;
  addEvent: (newEvent: Events) => void;
  getAllEvents: () => Events[];
}

const useEventStore = create<EventState>()(
  devtools(
    persist(
      (set, get) => ({
        events: [],
        setEvents: (events: Events[]) => set((state) => ({ ...state, events })),
        updateEvent: (updatedEvent: Events) =>
          set((state) => ({
            events: state.events.map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event
            ),
          })),
        getEventById: (eventId: string) => get().events.find((event) => event.id === eventId),
        addEvent: (newEvent: Events) =>
          set((state) => ({
            events: [...state.events, newEvent],
          })),
        getAllEvents: () => {
          return get().events;
        },
      }),
      {
        name: "event-storage",
      }
    )
  )
);

export default useAuthStore;
export { useBrandStore, useAdStore, useEventStore };
