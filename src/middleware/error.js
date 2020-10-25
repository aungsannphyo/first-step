const { validationResult } = require("express-validator");

const error = (req, res, next) => {
    //check server side validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array()[0].msg });
    }

    next();
};

module.exports = error;
