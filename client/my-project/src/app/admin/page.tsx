'use client'
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { functionsFromApp } from "@/firebase/config";

import signout from "@/firebase/auth/signout";

function Page() {
    const { user }: any = useAuthContext();
    const router = useRouter();

    const [ailmentButtonStates, setAilmentButtonStates] = useState<{ [key: string]: boolean }>({});
    const [ailments, setAilments] = useState([]);

    useEffect(() => {
        const getAllPatients = async () => {
            const importedFunction = httpsCallable(functionsFromApp, "getAilments");
            const result = await importedFunction();
            const data: any = result.data;
            setAilments(data);
        };

        if (user == null) {
            router.push("/");
        } else {
            getAllPatients();
        }
    }, [user, router]);

    const handleSignout = async () => {
        await signout();
    }

    const handleAilmentButtonClick = async (ailment: string) => {
        setAilmentButtonStates(prevState => ({
            ...prevState,
            [ailment]: !prevState[ailment]
        }));        
    }
    
    return (
        <div className="flex flex-col bg-white max-w-6xl mx-auto p-8 md:p-5 my-10 shadow-2xl rounded">
            <div className="flex flex-row space-x-96">
                <h1 className="text-blue-500 p-6 font-bold text-4xl">Hello, {user?.email}</h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-5 rounded-full w-1/4 h-1/4 hover:-translate-y-1 hover:scale-110 duration-200"
                    onClick={handleSignout}>
                    Sign out
                </button>
            </div>

            <div className="flex flex-row items-center justify-center">
                <div className="flex flex-col w-4/5 items-center justify-center">
                    <div className="bg-white max-w-6xl mx-auto p-8 md:p-12 my-10 shadow-2xl rounded w-full">
                        <h1 className="text-blue-800 p-6 font-medium text-2xl">Here are some of the things your doctor has put on your list:</h1>
                    </div>
                    {ailments.map((obj: any) => {
                        const { name, faq } = obj;

                        return (
                            <button
                                key={name}
                                className={`w-full bg-white mx-auto md:p-6 my-10 shadow-2xl rounded hover:bg-gray-100 w-1/2 text-blue-500 ${ailmentButtonStates[name] ? 'h-auto' : 'h-1/4'} hover:-translate-y-1 hover:scale-110 duration-200`}
                                onClick={() => handleAilmentButtonClick(name)}
                            >
                                <h1 className="font-medium text-2xl">
                                    {name}
                                </h1>
                                <div className={`pt-4 text-left ${ailmentButtonStates[name] ? '' : 'hidden'}`}>
                                    <p>Common questions about {name}:</p>
                                    {faq.map((qaObj: any, i: number) => {
                                        const { Q, A } = qaObj;
                                        return (<div className={`my-5`} key={i}>
                                            <p className={`bg-blue-200`} key={"q"+i}>{Q}</p>
                                            <p className={`bg-green-200`} key={"a"+i}>{A}</p>
                                        </div>)
                                    })}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Page;
