import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, //sparse means specific to this field, it allows multiple documents to have null values for this field without violating the unique constraint. This is useful for fields that are optional, like email or phone, where not all users may provide a value. With sparse: true, only documents that have a non-null value for the email field will be subject to the uniqueness constraint, allowing multiple users to exist without an email address if they choose not to provide one.
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    googleId: String,
    avatar: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
