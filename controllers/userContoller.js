// "use strict";

// const firebase = require("../firebaseDB");
// const User = require("../models/usermodel");
// const { uploadProcessedData, getData } = require("../firebaseDB");

// const addUser = async (req, res, next) => {
//   try {
//     const data = req.body;
//     console.log(data);
//     var data1 = { email: "hellp@gmail.com", name: "Jhon Doe" };
//     await firestore.collection("users").doc().set(data1);
//     res.send("Record saved successfuly");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }

// //   const uuid = require('uuid');
// // console.log(uuid.v4());
// };

// const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await firestore.collection("devices");
//     const data = await users.get();
//     const usersArray = [];
//     if (data.empty) {
//       res.status(404).send("No student record found");
//     } else {
//       data.forEach((doc) => {
//         const student = new User(doc.id, doc.data().name, doc.data().email);
//         usersArray.push(student);
//       });
//       res.send(usersArray);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const getUser = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const users = await firestore.collection("users").doc(id);
//     const data = await users.get();
//     if (!data.exists) {
//       res.status(404).send("Student with the given ID not found");
//     } else {
//       res.send(data.data());
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const updateUser = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const users = await firestore.collection("users").doc(id);
//     await users.update(data);
//     res.send("Student record updated successfuly");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const deleteUser = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     await firestore.collection("users").doc(id).delete();
//     res.send("Record deleted successfuly");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const upload = async (req, res, next) => {
//   try {
//     console.log(req.body);
//     await uploadProcessedData(req.body);
//     res.send("Student record updated successfuly");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const get = async (req, res, next) => {
//   try {
//     const data = await getData();
//     res.send(data);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// module.exports = {
//   // addUser,
//   // getAllUsers,
//   // getUser,
//   // updateUser,
//   // deleteUser,
//   upload,
//   get,
// };

"use strict";
const { firestoreDb } = require("../firebaseDB");
const {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
  deleteDoc,
  getDoc,
  updateDoc,
  getFirestore,
} = require("firebase/firestore");
const crypto = require("crypto");

const getUserInfo = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const userId = req.params.id;

    const docRef = doc(firestoreDb, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.send(docSnap.data());
    } else {
      res.send("No such document!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const collectionRef = collection(firestoreDb, "users");
    const finalData = [];
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      finalData.push(doc.data());
    });
    res.send(finalData);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createUser = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const data = req.body;
    console.log(data);
    const userId = crypto.randomBytes(10).toString("hex");
    data.userId = userId;
    const docRef = doc(firestoreDb, "users", userId);
    const result = await setDoc(docRef, data);
    res.send("User created successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const data = req.body;
    const userId = req.params.id;
    console.log(userId);
    const docRef = doc(firestoreDb, "users", userId);
    await updateDoc(docRef, data);
    res.send("User updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const userId = req.params.id;
    const docRef = doc(firestoreDb, "users", userId);
    await deleteDoc(docRef);
    res.send("User deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getUserInfo,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
