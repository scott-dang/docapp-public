'use client'
import React, { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'

function Page() {    
    const router = useRouter();
    const { user }: any = useAuthContext();

    const signinHandler = () => {
        return (event: React.MouseEvent) => {
            router.push("/signin");
          event.preventDefault();
        }
    }
      
    const signupHandler = () => {
        return (event: React.MouseEvent) => {
            router.push("/signup");
          event.preventDefault();
        }
    }

    const doctorHandler = () => {
        return (event: React.MouseEvent) => {
            router.push("/doctor");
          event.preventDefault();
        }
    }

    useEffect(() => {
        if (user != null) {
            router.push("/admin")
        }
    }, [user, router]);

    return (
        
        <div className="wrapper h-screen flex items-center justify-center">
            <div className="bg-white w-1/2 rounded-3xl p-6 max-w-lg">
                <h1 className="text-6xl text-blue-500 text-center mb-6">This is Docapp.</h1>
                <div className="flex justify-center flex-col">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={signinHandler()}
                    >
                        Sign in with email
                    </button>
                    <br />
                    <button
                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={signupHandler()}
                    >
                        Sign up with email
                    </button>
                    <br />
                    <button
                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={doctorHandler()}
                    >
                        Doctor login (For demo purposes)
                    </button>
                </div>
            </div>
      </div>
    );
}

export default Page;
