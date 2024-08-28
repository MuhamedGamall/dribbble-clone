import mongoose, { model, models } from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true },
    posterUrl: { type: String, required: true },
    posterId: { type: String, required: true },
    projectUrl: { type: String },
    githubUrl: { type: String },
    category: { type: String, required: true, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ProjectSchema.methods.publicRead = function () {
  return this.toObject();
};

export const Project = models?.Project || model<any>("Project", ProjectSchema);
