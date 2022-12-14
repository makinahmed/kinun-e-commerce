import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, update } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, updateProfile, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { handleFirebaseError } from "./Handle";

const firebaseConfig = {
  apiKey: "AIzaSyA4OLhThWds7W1gIkFIq8wbeP2csI7Nwa0",
  authDomain: "kinun-ecommerce.firebaseapp.com",
  projectId: "kinun-ecommerce",
  storageBucket: "kinun-ecommerce.appspot.com",
  messagingSenderId: "997500455540",
  appId: "1:997500455540:web:ca72b3b61e557d21791f21",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async (setSnackbar) => {
  const prevUserData = await GetPrevUserData();
  try {
    const signInLogin = await signInWithPopup(auth, provider)
    await update(ref(db, `users/${auth.currentUser.uid}`), {
      uid: signInLogin.user.uid,
      displayName: signInLogin.user.displayName,
      ...prevUserData
    });
    setSnackbar({
      ...handleFirebaseError("golg"),
      open: true,
    })
  } catch (error) {
    setSnackbar({
      ...handleFirebaseError(error.code),
      open: true,
    })
  }
};

const registerWithUserAndPassword = async (inputs) => {
  try {
    const prevUserData = await GetPrevUserData();
    await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
    await updateProfile(auth.currentUser, {
      displayName: inputs.userName
    })
    await update(ref(db, `users/${auth.currentUser.uid}`), {
      uid: auth.currentUser.uid,
      displayName: inputs.userName,
      ...prevUserData
    })
  } catch (error) {
    throw error;
  }
}

const LoginWithEmailAndPassword = async (inputs) => {
  try {
    // const prevUserData = await GetPrevUserData();
    // console.log(prevUserData)
    await signInWithEmailAndPassword(auth, inputs.email, inputs.password);
    // await update(ref(db, `users/${auth.currentUser.uid}`), {
    //   ...prevUserData
    // });
  } catch (error) {
    throw error;
  }
}

const AnonymouslySignIn = async () => {
  await signInAnonymously(auth)
  await update(ref(db, `users/${auth.currentUser.uid}`), {
    uid: auth.currentUser.uid,
  });
};

const GetUserWishList = async () => {
  const dbRef = ref(db);
  const data = await get(child(dbRef, `users/${auth.currentUser.uid}/wishlist`));
  return (data.exists() ? data.val() : [])
}

const AddToWishList = async (wishListArray) => {
  await update(ref(db, `users/${auth.currentUser.uid}`), {
    "wishlist": wishListArray
  })
}

const GetUserCart = async () => {
  const dbRef = ref(db);
  const data = await get(child(dbRef, `users/${auth.currentUser.uid}/cart`));
  return (data.exists() ? data.val() : [])
}

const AddToCartList = async (cartListArray) => {
  await update(ref(db, `users/${auth.currentUser.uid}`), {
    "cart": cartListArray
  })
}

const GetPrevUserData = async () => {
  const dbRef = ref(db);
  const data = await get(child(dbRef, `users/${auth.currentUser.uid}`));
  return {
    cart: data.val().cart || [],
    wishlist: data.val().wishlist || [],
  };
}

export { db, auth, signInWithGoogle, registerWithUserAndPassword, LoginWithEmailAndPassword, AnonymouslySignIn, GetUserWishList, AddToWishList, GetUserCart, AddToCartList }