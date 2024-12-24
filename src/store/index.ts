import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { IBranch } from "@/@types/interfaces/IBranch";

interface IStore {
  isSidebarOpen: boolean;
  isHttpClientLoading: boolean;
  userToken?: string | null;
  myUser?: any;
  branch?: IBranch;
  email?: string;
}

export const useAppStore = createWithEqualityFn<IStore>(
  (_set) => ({
    isSidebarOpen: false,
    isHttpClientLoading: true,
  }),
  shallow,
);
