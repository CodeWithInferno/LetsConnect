'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const AuthUserContext = createContext(null);

export const AuthUserProvider = ({ children }) => {
    const { user, isLoading, error } = useUser();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetch(`/api/user/get?email=${user.email}`)
                .then((res) => res.json())
                .then((data) => setUserInfo(data))
                .catch((err) => console.error("Error fetching user info:", err));
        }
    }, [user]);

    return (
        <AuthUserContext.Provider value={{ user, userInfo, isLoading, error }}>
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuthUser = () => useContext(AuthUserContext);
