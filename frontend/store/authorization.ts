import {create} from "zustand";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthorizationState {
    user: User | undefined;
    setUser: (user: User | undefined) => void;
}

const useAuthorizationStore = create<AuthorizationState>((set)=> ({
    user: undefined,
    setUser: (user: User | undefined) => set({user})
}));

export const useGetUser = () => {
    return useAuthorizationStore((state) => state.user);
}

    

