const Admin = require("../models/admin");

//register controller
exports.register = async (req, res, next) => {
    //check admin permission
    if (!req.admin.isCreatable) {
        return res
            .status(401)
            .send({ error: "You have no access to create a new admin user" });
    }

    //create a new admin
    const admin = new Admin(req.body);
    try {
        await admin.save();
        res.status(201).send({ data: admin });
    } catch (err) {
        if (err.code === 11000) {
            res.status(422).send({ error: "Email already exists" });
        }
    }
};

//login controller
exports.login = async (req, res, next) => {
    try {
        //login method using findByCredentials => adminSchema.statics
        const admin = await Admin.findByCredentials(
            req.body.email,
            req.body.password
        );

        //generate token => adminSchema.methods
        const token = await admin.generateAuthToken();
        res.status(200).send({ data: { admin, token, expireIn: "24hr" } });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

//change password controller
exports.changePassword = async (req, res, next) => {
    //check allow  update request
    const updates = Object.keys(req.body);
    const allowUpdates = ["password", "password-confirmation"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    //if not send invalid updates request
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates request" });
    }

    try {
        req.admin[updates[0]] = req.body[updates[0]];
        await req.admin.save();
        res.status(200).send({ data: "Successful updated" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

//update profile controller
exports.updateProfile = async (req, res, next) => {
    //check allow  update request
    const updates = Object.keys(req.body);
    const allowUpdates = ["name"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    //if not send invalid updates request
    if (!isValidOperation) {
        return res.status(400).send({ erro: "Invalid updates request" });
    }

    try {
        updates.forEach((update) => (req.admin[update] = req.body[update]));
        await req.admin.save();
        res.status(200).send({ data: "Successful updated" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

//profile
exports.profile = async (req, res, next) => {
    res.status(200).send({ data: req.admin });
};

//seeder
exports.seeder = async (req, res) => {
    try {
        const adminCount = await Admin.find().countDocuments();
        //check there have one or more admin
        if (adminCount > 0) {
            return res
                .status(422)
                .send({ data: "There have one more admin user" });
        } else {
            const admin = new Admin({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                isCreatable: process.env.ADMIN_ISCREATABLE,
            });

            await admin.save();
            res.status(201).send({
                data: "You have been successfully created default admin user",
            });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};