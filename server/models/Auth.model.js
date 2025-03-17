const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AuthSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

AuthSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Auth", AuthSchema);
