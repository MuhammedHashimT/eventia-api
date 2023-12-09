"use strict";
// const { firestoreDb } = require("../firebaseDB");
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

const getAllEvents = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const collectionRef = collection(firestoreDb, "events");
    const finalData = [];
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      finalData.push(doc.data());
    });
    res.send(finalData);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getEventInfo = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const eventId = req.params.id;

    const docRef = doc(firestoreDb, "events", eventId);
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

const getEventByOwner = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    console.log(firestoreDb);
    const ownerId = req.params.id;
    const collectionRef = collection(firestoreDb, "events");
    const finalData = [];
    const q = query(collectionRef, where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      finalData.push(doc.data());
    });
    res.send(finalData);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const data = req.body;
    console.log(data);
    const eventId = crypto.randomBytes(10).toString("hex");
    data.eventId = eventId;
    const docRef = doc(firestoreDb, "events", eventId);
    const result = await setDoc(docRef, data);
    res.send("Event created successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const data = req.body;
    const eventId = req.params.id;
    console.log(eventId);
    const docRef = doc(firestoreDb, "events", eventId);
    await updateDoc(docRef, data);
    res.send("Event updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const firestoreDb = getFirestore();
    const eventId = req.params.id;
    const docRef = doc(firestoreDb, "events", eventId);
    await deleteDoc(docRef);
    res.send("Event deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventInfo,
  getEventByOwner,
  getAllEvents,
};
