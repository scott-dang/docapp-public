import { createContext, useContext, useState, useEffect } from 'react';

import {
    onAuthStateChanged,
    getAuth,
    User
} from 'firebase/auth';

import firebase_app from '@/firebase/config';

const auth = getAuth(firebase_app);

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children, }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div className='text-white font-bold text-4xl my-10'><center>Please be patient, patient...</center></div> : children}
        </AuthContext.Provider>
    );
};
