import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../constants/config';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function initFirebase() {
  if (!app) {
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  return { app, auth, db, storage };
}

export function getFirebaseApp() {
  if (!app) initFirebase();
  return { app, auth: auth!, db: db!, storage: storage! };
}

export const authService = {
  signUp: async (email: string, password: string, name: string) => {
    const { auth } = getFirebaseApp();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db!, 'users', result.user.uid), {
      name,
      email,
      createdAt: Timestamp.now(),
    });
    return result.user;
  },

  signIn: async (email: string, password: string) => {
    const { auth } = getFirebaseApp();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  signOut: async () => {
    const { auth } = getFirebaseApp();
    await signOut(auth);
  },

  onAuthChange: (callback: (user: FirebaseUser | null) => void) => {
    const { auth } = getFirebaseApp();
    return onAuthStateChanged(auth, callback);
  },

  getProfile: async (userId: string) => {
    const { db } = getFirebaseApp();
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.data();
  },

  updateProfile: async (userId: string, data: any) => {
    const { db } = getFirebaseApp();
    await updateDoc(doc(db, 'users', userId), data);
  },
};

export const matchService = {
  create: async (match: any) => {
    const { db } = getFirebaseApp();
    const matchRef = doc(collection(db, 'matches'));
    await setDoc(matchRef, { ...match, id: matchRef.id, createdAt: Timestamp.now() });
    return matchRef.id;
  },

  getAll: async () => {
    const { db } = getFirebaseApp();
    const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id: string) => {
    const { db } = getFirebaseApp();
    const docSnap = await getDoc(doc(db, 'matches', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  update: async (id: string, data: any) => {
    const { db } = getFirebaseApp();
    await updateDoc(doc(db, 'matches', id), data);
  },
};

export { Timestamp };
