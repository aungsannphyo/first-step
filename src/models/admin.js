const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    isCreatable: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "owner",
})

//hide data when response json
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();

  delete adminObject.password;
  delete adminObject.token;
  delete adminObject.__v;
  return adminObject;
};

//generate json web token
adminSchema.methods.generateAuthToken = async function () {
  const admin = this;

  const token = jwt.sign(
    { _id: admin._id.toString() },
    process.env.TOKEN_SECURE,
    { expiresIn: "24hr" }
  );

  admin.token = token;
  await admin.save();

  return token;
};

//check login email and password
adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email: email });

  if (!admin) {
    throw new Error("Check your email or password!. Unable to Login!");
  }

  //verify password bcrypt
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Check your email or password!. Unable to Login!");
  }
  return admin;
};

//password hashing middleware before saving
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
