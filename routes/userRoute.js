// const express = require("express");
// const router = express.Router();
// const User = require("../models/usermodel"); // Replace with the actual path to your User model
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { protect } = require("../utils/authMiddleware");
// const firebase = require("firebase-admin");

// // Initialize Firebase
// const db = firebase.firestore();

// // Admin login route
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ error: "please enter username and password" });
//   }
//   // Find the user by their username
//   User.findOne({ username })
//     .then((user) => {
//       // if (!user) {
//       //   return res.status(404).json({ error: "User not found" });
//       // }

//       // // Compare the provided password with the stored hashed password
//       // bcrypt.compare(password, user.password, (err, result) => {
//       //   if (err) {
//       //     return res.status(500).json({ error: "Internal server error" });
//       //   }

//       //   if (!result) {
//       //     return res.status(401).json({ error: "Invalid password" });
//       //   }

//       //   // Authentication successful
//       //   // Generate a JWT token
//       //   const token = jwt.sign(
//       //     { userId: user._id },
//       //     process.env.JWT_SECRET_KEY,
//       //     { expiresIn: "1y" }
//       //   );

//       //   // Set the token as a cookie in the response with a 1-year expiration
//       //   res.cookie("login_token", token, {
//       //     httpOnly: true,
//       //     secure: true,
//       //     expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
//       //   });

//       //   res.status(200).json({ message: "Sign in successful" ,token, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
//       // });
//       // });
//       try {
//         const id = req.body.id;
//         const user = {
//           email: req.body.email
//         }
//         const response = db.collection('users').add(user);
//         res.send(response);
//       } catch (error) {
//         res.send(error);
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "Internal server error" });
//     });
// });
// router.get('/', protect, async (req, res) => {
//   try {

//     const userId = req.user._id;

//     // Fetch the user details from the database using the userId
//     const user = await User.findById(userId).select('-password');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Return the user details (excluding the password) in the response
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// // Admin signup route
// router.post("/signup", (req, res) => {
//   const { username, password } = req.body;

//   // Check if user with the same username already exists
//   User.findOne({ username })
//     .then((existingUser) => {
//       if (existingUser) {
//         return res.status(400).json({ error: "User already exists" });
//       }

//       // Generate a hash of the password using bcrypt
//       bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//           return res.status(500).json({ error: "Internal server error" });
//         }

//         // Create a new user object
//         const newUser = new User({ username, password: hashedPassword });

//         // Save the new user to the database
//         newUser
//           .save()
//           .then(() => {
//             // Send a success response
//             res.status(201).json({ message: "User created successfully" });
//           })
//           .catch((error) => {
//             res
//               .status(500)
//               .json({ error: `Error saving user to the database ${error}` });
//           });
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "Internal server error" });
//     });
// });

// module.exports = router;

const express = require("express");
const {
  createUser,
  deleteUser,
  updateUser,
  getUserInfo,
  getAllUsers,
} = require("../controllers/userContoller");
const jwt = require("jsonwebtoken");
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


const router = express.Router();
router.post("/user", createUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserInfo);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// Admin login route
router.post("/login", async (req, res) => {
  const data = req.body;
  // Find the user by their email
  try {
    const firestoreDb = getFirestore();
    const collectionRef = collection(firestoreDb, "users");
    let userData;
    const q = query(collectionRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    } else {
      // Generate a JWT token
      const token = jwt.sign(
        { userId: userData.userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1y" }
      );

      //  Set the token as a cookie in the response with a 1-year expiration
      res.cookie("login_token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      });

      res.status(200).json({
        message: "Sign in successful",
        token,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      });
    }

    // res.send(finalData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Admin signup route
router.post("/signup", async (req, res) => {
  const data = req.body;
  // Check if user with the same email already exists
  try {
    const firestoreDb = getFirestore();
    const collectionRef = collection(firestoreDb, "users");
    const finalData = [];
    const q = query(collectionRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      finalData.push(doc.data());
    });
    if (finalData.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const userId = crypto.randomBytes(10).toString("hex");
      data.userId = userId;
      const docRef = doc(firestoreDb, "users", userId);
      const response = await setDoc(docRef, data);
      res.send("User created successfuly");
    }
    // res.send(finalData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = {
  routes: router,
};
