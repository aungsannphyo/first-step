const express = require("express");

const adminController = require("../controller/adminController");

const auth = require("../middleware/auth");
const error = require("../middleware/error");
const adminValid = require("../helpers/adminValid");
const router = new express.Router();

//all route prefix /admin

// post => /login
router.post("/login", adminValid.login, error, adminController.login);

//to access after login using token => using auth middleware  -> all of the below routes

// post => /register
router.post(
    "/register",
    adminValid.register,
    error,
    auth,
    adminController.register
);

//patch => /change-password
router.patch(
    "/update-password",
    adminValid.updatePassword,
    error,
    auth,
    adminController.changePassword
);

//patch => /update-profile
router.patch(
    "/update-profile",
    adminValid.updateProfile,
    error,
    auth,
    adminController.updateProfile
);

// get => /profile
router.get("/profile", auth, adminController.profile);

//get => /blogs
router.get("/blogs", auth, adminController.blogs)

//make seeder
router.post("/seeder", adminController.seeder);

module.exports = router;
