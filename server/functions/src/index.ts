import * as functions from "firebase-functions";
import * as dotenv from "dotenv";
import * as firebaseAdmin from "firebase-admin";
import {OpenAI} from "openai";

dotenv.config();

const gptAPI = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const app = firebaseAdmin.initializeApp();
const db = app.firestore();

interface Ailment {
    name: string,
    faq: {[Q: string]: string}[],
}

interface Patient {
    email: string,
    userID: string,
    ailments: Ailment[],
}

const excludeGPTFiller =
    "Answer it in question and answer format as concisely " +
    "as possible. Make sure response is in the format question1, " +
    "answer1, question2, answer2, etc...";

const generateFaq = (async (ailment: string) => {
    const faqPrefix = "Generate 6 frequently asked questions if I have";
    const query: string = [faqPrefix, ailment, excludeGPTFiller].join(" ");
    try {
        const completion = await gptAPI.chat.completions.create({
            messages: [{role: "user", content: query}],
            model: "gpt-3.5-turbo",
        });
        return completion?.choices[0]?.message?.content || "Error";
    } catch (error) {
        return "Error";
    }
});

interface nameToId {
    [id: string]: string,
}

exports.getAllPatients = functions.https.onCall(async () => {
    const docList = await db.collection("users").get();
    const nameToId: nameToId = {};
    docList.docs.map((userSnapshot) => {
        const user = userSnapshot.data();
        nameToId[user.email] = userSnapshot.id;
    });
    return nameToId;
});


exports.getAilments = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        return "You must be logged in";
    }

    const user = await db.collection("users").doc(context.auth.uid).get();
    const ailments = user.data()?.ailments;
    if (!ailments) {
        return "Error";
    }
    return ailments;
});

exports.deleteAilment = functions.https.onCall(async (data, _) => {
    const userID = data.userID;
    if (!userID) {
        return "You must specify a user ID";
    }

    const docRef = db.collection("users").doc(userID);
    const doc = await docRef.get();
    if (!doc.exists) {
        return "Invalid user ID";
    }

    const ailmentToRemove: string = data.ailment;
    const newAilments: Ailment[] = doc.data()?.ailments
        .filter((ailment: Ailment) => {
            const {name} = ailment;
            return name.toLowerCase() !== ailmentToRemove.toLowerCase();
        });

    await db.collection("users").doc(userID)
            .set({ailments: newAilments}, {mergeFields: ["ailments"]});
    return "Success";
});

exports.addAilment = functions.https.onCall(async (data, _) => {
    const userID = data.userID;
    if (!userID) {
        return "You must specify a user ID";
    }

    const docRef = db.collection("users").doc(userID);
    const doc = await docRef.get();
    if (!doc.exists) {
        return "Invalid user ID";
    }

    const ailment = data.ailment;
    const raw: string = await generateFaq(ailment);
    if (raw === "Error") {
        return "Error";
    } else {
        let delimiter: RegExp;
        if (raw.substring(0, 2) === "1.") {
            delimiter = /(?=\d\.)/;
        } else if (raw.substring(0, 2) === "Q1") {
            delimiter = /(?=Q\d:)/;
        } else if (raw.substring(0, "Question 1".length) === "Question 1") {
            delimiter = /(?=Question\s\d:)/;
        } else {
            return "Error";
        }

        const pairs: {[Q: string]: string}[] = raw.split(delimiter)
            .map((s) => {
                const [q, a] = s.split(/\n/);
                return {"Q": q, "A": a};
            });


        const oldAilments: Ailment[] = await doc.get("ailments");
        const newAilment: Ailment = {name: ailment, faq: pairs};
        const newAilments = {ailments: [...oldAilments, newAilment]};
        await doc.ref.set(newAilments, {merge: true});

        return "Success";
    }
});

exports.onPatientSignup = functions.auth.user().onCreate(async (user) => {
    const userID = user.uid;
    const email = user.email || "";

    const userData: Patient = {
        email,
        userID,
        ailments: [],
    };

    await db.collection("users").doc(userID).set(userData);
});

exports.onPatientDelete = functions.auth.user().onDelete(async (user) => {
    const userID = user.uid;
    await db.collection("users").doc(userID).delete();
});

// exports.testFAQ = functions.https.onCall(async (ailment: string) => {
//     const raw: string = await generateFaq(ailment);
//     if (raw === "Error") {
//         console.log(raw);
//         return [];
//     } else {
//         let delimiter: RegExp;
//         if (raw.substring(0,2) === "1.") {
//             delimiter = /(?=\d\.)/;
//         } else if (raw.substring(0,2) === "Q1") {
//             delimiter = /(?=Q\d:)/;
//         } else if (raw.substring(0,"Question 1".length) === "Question 1") {
//             delimiter = /(?=Question\s\d:)/;
//         } else {
//             console.log("ERROR");
//             return [];
//         }
//         const pairs: string[][] = raw.split(delimiter)
//             .map((s) => {
//                 const [q,a] = s.split(/\n/);
//                 return [q,a];
//             });
//         return pairs;
//     }
// });
