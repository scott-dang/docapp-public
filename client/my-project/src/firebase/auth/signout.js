import { signOut, getAuth } from "firebase/auth";

export default async function signout() {
    const auth = getAuth();
    await signOut(auth);
}
