import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance using the custom database ID from configuration
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

/**
 * Fetch the website content directly from Firestore
 */
export async function fetchContentFromFirestore(): Promise<any | null> {
  try {
    const docRef = doc(db, "config", "website");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Failed to fetch content directly from Firestore:", error);
  }
  return null;
}

/**
 * Save the website content directly to Firestore
 */
export async function saveContentToFirestore(content: any): Promise<boolean> {
  try {
    const docRef = doc(db, "config", "website");
    await setDoc(docRef, content);
    console.log("Successfully saved content directly to Firestore from browser.");
    return true;
  } catch (error) {
    console.error("Failed to save content directly to Firestore:", error);
    return false;
  }
}
