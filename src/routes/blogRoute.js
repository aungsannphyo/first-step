const express = require("express");
const multer = require("multer");

const blogController = require("../controller/blogController");
const blogValid = require("../helpers/blogValid");
const auth = require("../middleware/auth");
const error = require("../middleware/error");

const router = new express.Router();

//file upload setting
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an Image"));
    }
    cb(undefined, true);
  },
});

// get => /blogs/:id/image => get image url route => serving image
router.get("/blogs/:id/image", blogController.servingImage);

//get => /blogs => get all blog
router.get("/blogs", blogController.getAll);

//after authenticate
// post => /blogs => create a new blogs
router.post(
  "/blogs",
  upload.single("image"),
  blogValid.create,
  error,
  auth,
  blogController.create,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete => /blogs/:id => delete route
router.delete("/blogs/:id", auth, blogController.delete);

//update => /blogs/:id => update route
router.put(
  "/blogs/:id",
  upload.single("image"),
  blogValid.create,
  error,
  auth,
  blogController.update
);

module.exports = router;
