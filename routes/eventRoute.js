const express = require("express");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventInfo,
  getEventByOwner,
  getAllEvents,
} = require("../controllers/eventController");
const fileUpload = require('express-fileupload');

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/event/:id', getEventInfo);
router.get('/event/owner/:id', getEventByOwner);
router.post('/event', fileUpload(), createEvent);
router.put('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);

module.exports = {
  routes: router,
};
