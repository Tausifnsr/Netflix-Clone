import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCxhIjn_m8nJu-HLml5f_2DljvHqNEjBXs",
    authDomain: "netflix-clone-d699b.firebaseapp.com",
    projectId: "netflix-clone-d699b",
    storageBucket: "netflix-clone-d699b.appspot.com",
    messagingSenderId: "927917712721",
    appId: "1:927917712721:web:cdf9ef78f6d31e31249f70"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { auth };
  export default db;