import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* -------------------- ADDRESS SUB-SCHEMA -------------------- */
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Invalid pincode"],
    },
    country: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

/* -------------------- USER SCHEMA -------------------- */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      select: false,
    },

    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    providerId: {
      type: String,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    addresses: [addressSchema],

    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

/* -------------------- PASSWORD HASH HOOK -------------------- */
userSchema.pre("save", async function () {
  // OAuth users do not have passwords
  if (!this.password) return;

  // Prevent double hashing
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


/* -------------------- MODEL EXPORT -------------------- */
const User = mongoose.model("User", userSchema);
export default User;
