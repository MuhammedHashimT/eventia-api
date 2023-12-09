const config = require("./config");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");
const crypto = require("crypto");

let app;
let firestoreDb;
const initializeFirebaseApp = () => {
  try {
    app = initializeApp(config.firebaseConfig);
    return app;
  } catch (error) {
    console.log(error);
  }
};

const uploadProcessedData = async (data) => {
  const dataToUpload = {
    key: "value",
    key1: 123,
  };

  try {
    const uniqueId = crypto.randomBytes(10).toString("hex");
    data.userId = uniqueId;
    const docRef = doc(firestoreDb, "users", uniqueId);
    const result = await setDoc(docRef, data);

    await updateDoc(docRef, {
      key: "value1",
      key1: 1,
      name: "test",
    });

    await deleteDoc(doc(firestoreDb, "users", "8c6ec87b367b9e516e2d"));

    return result;
  } catch (error) {
    console.log(error);
  }
};

const getData = async (from, to) => {
  try {
    const collectionRef = collection(firestoreDb, "users");
    const finalData = [];
    const q = query(collectionRef, where("email", "==", "adf"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      finalData.push(doc.data());
    });
    return finalData;
  } catch (error) {
    console.log(error);
  }
};

const getFirebaseApp = () => app;

module.exports = {
  initializeFirebaseApp,
  getFirebaseApp,
  uploadProcessedData,
  getData
};
