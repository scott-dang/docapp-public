'use client'
import React from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation'

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [failed, setFail] = React.useState('')
    const router = useRouter()

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            setFail("Failed to login")
            return console.log(error)
        }

        // else successful
        console.log(result)
        return router.push("/admin")
    }

    const backHandler = () => {
        return (event: React.MouseEvent) => {
            setFail("")
            router.back()
          event.preventDefault();
        }
    }

    return (
    <div className="">
        <a onClick={backHandler()} className="content-center">
            <h1 className="text-4xl font-bold text-white text-center my-5">DocApp Patients</h1>
        </a>
        <br />
        <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 shadow-2xl rounded">
            <section>
                <h3 className="font-bold text-4xl"><center>Welcome!</center></h3>
            </section>

            <section>
                <h3 className="relative font-bold text-xl my-5"><center className="text-red-600">{failed}</center></h3>
            </section>

            <section className="mt-10">
                <form className="flex flex-col" method="POST" action="welcome.html" onSubmit={handleForm}>
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email">Email</label>
                    <div className="mb-6 pt-3 bg-gray-200">
                        <input 
                            type="email" id="email" className="bg-gray-200 w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 px-3 pb-3"
                            onChange={(e) => setEmail(e.target.value)} required name="email" placeholder="example@mail.com" >
                            </input>
                    </div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password">Password</label>
                    <div className="mb-6 pt-3 bg-gray-200">
                        <input 
                            type="password" id="password" className="bg-gray-200  w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 px-3 pb-3"
                            onChange={(e) => setPassword(e.target.value)} required name="password" placeholder="password" >
                            </input>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit">Sign In</button>
                </form>
            </section>
        </div>
    </div>);
}




export default Page;
