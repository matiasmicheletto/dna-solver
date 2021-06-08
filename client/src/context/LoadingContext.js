import { createContext } from 'react';

export const LoadingContext = createContext({
    loading: true,
    setLoading: ()=>{}
});