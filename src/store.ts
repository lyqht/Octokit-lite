import { User } from '@supabase/supabase-js';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import {
  GetRepositoriesResponse,
  HistoryRecord,
  Repositories,
} from './types/github';

interface UserState {
  user: User | null;
  repos: Repositories;
  historyRecords: { deleted: HistoryRecord[]; updated: HistoryRecord[] };
  setUser: (user: any | null) => void;
  setRepos: (repos: Repositories) => void;
  fetchRepos: (providerToken: string) => void;
  fetchDeletedRecords: (providerToken: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  repos: [],
  historyRecords: { deleted: [], updated: [] },
  setUser: (user) => set(() => ({ user })),
  setRepos: (repos) => set(() => ({ repos })),
  fetchRepos: async (providerToken) => {
    const githubResponse = await fetch(
      `api/github?provider_token=${providerToken}`,
    );
    const { repos }: GetRepositoriesResponse = await githubResponse.json();
    set({ repos });
  },
  fetchDeletedRecords: async (userId) => {
    const dbResponse = await fetch(`api/supabase?userId=${userId}`);
    const deleted = await dbResponse.json();
    set((state) => ({ historyRecords: { ...state.historyRecords, deleted } }));
  },
}));

if (process.env.NODE_ENV === `development`) {
  mountStoreDevtool(`Store`, useUserStore);
}
