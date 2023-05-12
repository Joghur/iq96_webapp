/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from 'react';
import {firebaseConfig} from '../../settings/firebaseConfig';
import {initializeApp} from 'firebase/app';
import {User, getAuth, onAuthStateChanged} from 'firebase/auth';
import {
  collection,
  getFirestore,
  orderBy,
  updateDoc,
  query,
  addDoc,
  DocumentData,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  where,
  Timestamp,
  Query,
  CollectionReference,
} from 'firebase/firestore';

export interface DocumentUser {
  id: string;
  uid: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isBoard: boolean;
  isSuperAdmin: boolean;
  locationId: string;
  name: string;
  nick: string;
  title: string;
}

export type CollectionName = 'events' | 'map' | 'chats';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const useFirestore = <T extends DocumentData>(
  collectionName: CollectionName,
  order: string,
) => {
  const [docs, setDocs] = useState<T[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, collectionName);

  const addingDoc = async (document: T) => {
    await addDoc(collectionRef, document);
  };

  const updatingDoc = async (id: string, document: T) => {
    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, {...document});
  };

  const deletingDoc = async (id: string) => {
    const docRef = doc(collectionRef, id);
    deleteDoc(docRef)
      .then(() => {
        console.log(`Document with ID ${id} deleted successfully!`);
      })
      .catch(error => {
        console.error(`Error deleting document with ID ${id}: `, error);
      });
  };

  useEffect(() => {
    const queryRef = query(
      collection(db, collectionName) as CollectionReference<T>,
      orderBy(order),
    ) as Query<T>;
    const unsubscribe = onSnapshot(queryRef, snapshot => {
      const docs: T[] = [];
      snapshot.forEach(doc => {
        docs.push({id: doc.id, ...doc.data()});
      });
      setDocs(docs as T[]);
      setLoading(false);
    });
    return unsubscribe;
  }, [db, collectionName]);

  return {docs, loading, addingDoc, updatingDoc, deletingDoc};
};

export const useFirestoreMax4Days = (
  collectionName: CollectionName,
  order: string,
  days = 4,
) => {
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, collectionName);

  const addingDoc = async (document: DocumentData) => {
    await addDoc(collectionRef, document);
  };

  const updatingDoc = async (id: string, document: DocumentData) => {
    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, {...document});
  };

  const deletingDoc = async (id: string) => {
    const docRef = doc(collectionRef, id);
    deleteDoc(docRef)
      .then(() => {
        console.log(`Document with ID ${id} deleted successfully!`);
      })
      .catch(error => {
        console.error(`Error deleting document with ID ${id}: `, error);
      });
  };

  useEffect(() => {
    const cutoff = Timestamp.fromMillis(
      Date.now() - days * 24 * 60 * 60 * 1000,
    );

    // create a Firestore query to fetch documents where createdAt is less than or equal to the cutoff time
    const collectionRef = query(
      collection(db, collectionName),
      where('createdAt', '>=', cutoff),
      orderBy(order),
    );
    // const collectionRef = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(collectionRef, snapshot => {
      const docs: DocumentData[] = [];
      snapshot.forEach(doc => {
        docs.push({id: doc.id, ...doc.data()});
      });
      setDocs(docs);
      setLoading(false);
    });
    return unsubscribe;
  }, [db, collectionName, days]);

  return {docs, loading, addingDoc, updatingDoc, deletingDoc};
};

export const useAuth = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setAuthUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return {authUser, loading};
};

export const copyMapMarkers = () => {
  getDocs(collection(db, 'map'))
    .then(querySnapshot => {
      const documents: DocumentData[] = [];

      querySnapshot.forEach(doc => {
        documents.push(doc.data());
      });

      setDoc(doc(db, 'oldmap', 'odense'), {
        documents: documents,
      })
        .then(() => {
          console.log('Documents copied successfully!');
        })
        .catch(error => {
          console.error('Error copying documents: ', error);
        });
    })
    .catch(error => {
      console.error('Error getting documents: ', error);
    });
};

export const deleteMapMarkers = () => {
  getDocs(collection(db, 'map'))
    .then(querySnapshot => {
      querySnapshot.forEach(document => {
        const docRef = doc(db, 'map', document.id);

        deleteDoc(docRef)
          .then(() => {
            console.log(
              `Document with ID ${document.id} deleted successfully!`,
            );
          })
          .catch(error => {
            console.error(
              `Error deleting document with ID ${document.id}: `,
              error,
            );
          });
      });
    })
    .catch(error => {
      console.error('Error getting documents: ', error);
    });
};

export const useDocumentUser = (): [
  User | null,
  DocumentUser | null,
  boolean,
] => {
  const [authUser, setFirebaseUser] = useState<User | null>(null);
  const [documentUser, setDocumentUser] = useState<DocumentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const {authUser: _authUser, loading: _loading} = useAuth();

  useEffect(() => {
    if (!_loading && _authUser) {
      setFirebaseUser(_authUser);

      const q = query(
        collection(db, 'users'),
        where('uid', '==', _authUser.uid),
      );
      getDocs(q)
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data() as DocumentUser;
            setDocumentUser({...docData, id: querySnapshot.docs[0].id});
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error getting document user:', error);
        });
    } else {
      setFirebaseUser(null);
      setDocumentUser(null);
      setLoading(false);
    }
  }, [db, _authUser, _loading]);

  return [authUser, documentUser, loading];
};
