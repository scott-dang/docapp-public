'use client'

import { useRouter } from 'next/navigation'
import { httpsCallable, HttpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { functionsFromApp } from '@/firebase/config';

function Page() {    
    const router = useRouter();
    const [users, setUsers] = useState<any>({});
    const [userAilment, setUserAilment] = useState<string>("")
    const [currentUserSelected, setCurrentUserSelected] = useState<string>("")

    useEffect(() => {
      const getAllPatients = async () => {
        const importedFunction: HttpsCallable = httpsCallable(functionsFromApp, "getAllPatients");
        const listOfUsers: any = (await importedFunction({})).data;
        setUsers(listOfUsers);
      };
      
      getAllPatients();
    }, []);

    const backHandler = () => {
      return (event: React.MouseEvent) => {
          router.back()
        event.preventDefault();
      }
    }

    const handleSelect = (email:string) => {
      return (event: React.MouseEvent) => {
        setCurrentUserSelected(email)
        event.preventDefault();
      }
    }

    const submitHandler = async (userEmail: string) => {
      const importedFunction: HttpsCallable = httpsCallable(functionsFromApp, "addAilment");
      const userID: any = users[userEmail];
      const result = (await importedFunction({userID, ailment: userAilment})).data;
    };

    return (
      <div className="flex flex-col items-center bg-white max-w-xl mx-auto p-8 md:p-12 my-10 shadow-2xl rounded-3xl">
        <button
          className="text-blue-500 p-6 font-bold text-4xl"
          onClick={backHandler()}
        >
          Doctor Patients
        </button>

        <ul className='w-full'>
          {Object.entries(users).map((entry: any) => {
            const [email] = entry;
            return(
              <li key={email}>
                <button className={`bg-white w-full md:w-xl mx-auto md:p-6 my-5 shadow-2xl rounded hover:bg-gray-100 text-blue-500 hover:-translate-y-1 hover:scale-110 duration-200`}
                  onClick={handleSelect(email)}
                  >
                  {email}
                </button>
              </li>
          )})}
        </ul>

        <div className='text-blue-500 font-bold'>Selected: {currentUserSelected}</div>

        <input 
          type="search" id="search" className="bg-gray-200 my-5 w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 px-3 pb-3"
          onChange={(e) => {setUserAilment(e.target.value)}} placeholder="add ailment" >
        </input>
        <button className="bg-blue-500 my-5 w-full hover:bg-blue-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" 
          onClick={() => submitHandler(currentUserSelected)}>Submit</button>
      </div>
    );
}

export default Page;
