import mongoose, { model, models } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    githubUrl: { type: String, default: "", trim: true },
    linkedinUrl: { type: String, default: "", trim: true },
    websiteUrl: { type: String, default: "", trim: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    seeing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followersCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.publicRead = function () {
  return this.toObject();
};
const User = models.User || model("User", UserSchema);
export default User;
