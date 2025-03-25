const express = require ("express");
const {
    getAppointments,
    getAppointment,
    bookAppointment,
    cancleAppointment
} = require("../controllers/carcares");

const {protect, authorize} = require("../middleware/auth");

const router = express.Router();

router.route("/")
    .get(protect, getAppointments)
    .post(protect, authorize('admin','user'), bookAppointment);

router.route("/:id")
    .get(protect, getAppointment)
    .delete(protect, authorize('admin','user'), cancleAppointment);

module.exports = router;