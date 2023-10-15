import firebase_app from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db_ = getFirestore(firebase_app)
export default async function addData(colllection, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db_, colllection, id), data, {
            merge: true,
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}