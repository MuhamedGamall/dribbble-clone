import mongoose, { model, models } from "mongoose";

const CreatorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true },
  avatarUrl: { type: String, required: true },
});
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    posterUrl: { type: String, required: true, trim: true },
    posterId: { type: String, required: true, trim: true },
    projectUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    viewership: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    creator: { type: CreatorSchema, required: true },
  },
  { timestamps: true }
);

ProjectSchema.methods.publicRead = function () {
  return this.toObject();
};

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
