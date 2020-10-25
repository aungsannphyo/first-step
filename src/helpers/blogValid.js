const { body } = require("express-validator");

const title = body("title", "Title must not be empty").not().isEmpty();
const content = body("content", "Content must not be empty").not().isEmpty();

exports.create = [title, content];
