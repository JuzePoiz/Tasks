'use client'
import { AuthProvider } from "../contexts/AuthContext";

export default function LayoutLogin({
    children,
}: Readonly<{children: React.ReactNode}>){
    return(
        <AuthProvider>
            {children}
        </AuthProvider>
      

    )
}