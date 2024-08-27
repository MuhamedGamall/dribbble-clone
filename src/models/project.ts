import mongoose, { model, models } from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    projectUrl: { type: String, required: true },
    githubUrl: { type: String, required: true },
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
