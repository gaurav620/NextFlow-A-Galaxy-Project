import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Asset {
  id: string;
  url: string;
  prompt: string;
  tool: string;
  timestamp: number;
  ratio: string;
  isFavorite: boolean;
}

interface AssetStore {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'timestamp' | 'isFavorite'>) => void;
  removeAsset: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAssets: () => void;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set) => ({
      assets: [],
      addAsset: (assetData) => set((state) => ({
        assets: [
          {
            ...assetData,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            isFavorite: false,
          },
          ...state.assets, // prepend new asset to the top
        ],
      })),
      removeAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
      })),
      toggleFavorite: (id) => set((state) => ({
        assets: state.assets.map((a) => 
          a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
        ),
      })),
      clearAssets: () => set({ assets: [] }),
    }),
    {
      name: 'nextflow-assets-storage', // unique name for localStorage key
    }
  )
);
