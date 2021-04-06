const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { roles } = require("../utils/constant");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmpassword: {
      type: String,
      required: true,
    },
    resetLink: {
      data: String,
      default:''
    },
    role: {
      type: String,
      enum: [roles.admin, roles.moderator, roles.client],
      default: roles.client,
    },
    tokens: [
      {
        tokens: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id.toString(),
      },
      process.env.SESSION_SECRET
    );
    this.tokens = this.tokens.concat({ tokens: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);

    if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      this.role = roles.admin;
    }
  }

  next();
});

userSchema.methods.validPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("userRegistration", userSchema);
module.exports = User;
