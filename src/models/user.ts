import mongoose, { model, models, Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, required: true },
    description: { type: String, default: ""},
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);
UserSchema.methods.publicRead = function () {
  return this.toObject();
};
export const User = models?.User || model<any>("User", UserSchema);
