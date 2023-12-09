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
const { driveConfig } = require("../utils/google/driveApi");
const nodemailer = require("nodemailer");
const { apiGoogle } = require("../utils/google/gmailApi");



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
    const data = req.body;
    console.log(data);
    // const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    // console.log(files);
    // const uploadFile = async (filePath, fileName, mimeType) => {
    //   // check the file is image
    //   if (!mimeType.includes('image')) {
    //     return res.status(400).send(`File is not an image`);
    //   }

    //   const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    //   try {
    //     const drive = driveConfig();
    //     const response = await drive.files.create({
    //       requestBody: {
    //         name: fileName,
    //         mimeType,
    //         parents: folderId ? [folderId] : [],
    //       },
    //       media: {
    //         mimeType,
    //         body: filePath,
    //       },
    //     });
    //     return response.data.id;
    //   } catch (error) {
    //     console.log(error);
    //     return res.status(400).send(`Error on google drive upload , check the image of ${fileName}`);
    //   }
    // }
    // const imageIds = await Promise.all(files.map(async (file) => {
    //   const imageId = await uploadFile(file.tempFilePath, file.name, file.mimetype);
    //   console.log(imageId);
    //   return imageId;
    // }))
    // data.images = imageIds;
    const eventId = crypto.randomBytes(10).toString("hex");
    data.eventId = eventId;
    const docRef = doc(getFirestore(), "events", eventId);
    const result = await setDoc(docRef, data);

    
    // sending email notifiacation to the user
    const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
    async function sendMail() {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "ahmedmsmd2005@gmail.com",
          clientId: driveClientId,
          clientSecret: driveClientSecret,
          refreshToken: driveRefreshToken,
          accessToken: apiGoogle(),
        },
      })

    // // find the user details
    //   const docRef = doc(getFirestore(), "users", data.ownerId);
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     // res.send(docSnap.data());
    //     const email = docSnap.data().email;
    //   } else {
    //     console.log("No such document!");
    //     // res.send("No such document!");
    //   }

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Team Eventia" <ahmedmsmd2005@gmail.com>', // sender address
        to: "ajnanpulikkathody@gmail.com", // list of receivers
        subject: "Hello Ajnan, your event is live", // Subject line
        text: "Ask your freinds to join your event. ✈️✈️", // plain text body
        // html: "<b>Hello world?</b>", // html body
      })
      return info;
    }
    await sendMail().then(result => console.log(result)).catch((err) => console.log(err));
    res.status(200).json({ message: "Event created successfully", data });
  } catch (error) {
    res.status(400).send(error.message);
  }




  // // Admin signup route
  // router.get("/mail", async (req, res) => {
  //   // const data = req.body;
  //   const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
  //   const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
  //   const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
  //   async function sendMail() {
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         type: "OAuth2",
  //         user: "ahmedmsmd2005@gmail.com",
  //         clientId: driveClientId,
  //         clientSecret: driveClientSecret,
  //         refreshToken: driveRefreshToken,
  //         accessToken: apiGoogle(),
  //       },
  //     })

  //     // send mail with defined transport object
  //     const info = await transporter.sendMail({
  //       from: '"Fred Foo 👻" <ahmedmsmd2005@gmail.com>', // sender address
  //       to: "hashimt4567@gmail.com", // list of receivers
  //       subject: "Hello ✔", // Subject line
  //       text: "Hello world?", // plain text body
  //       // html: "<b>Hello world?</b>", // html body
  //     })
  //     return info;
  //   }
  //   await sendMail().then(result => console.log(result)).catch((err) => console.log(err));

  // });

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
