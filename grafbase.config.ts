import { config, auth, graph } from "@grafbase/sdk";
const g = graph.Standalone();

// Property 'model' does not exist on type 'Graph'.

// @ts-ignore
const Project = {
  title: g.string().length({ min: 3 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),

  category: g.string(),

};
const User = {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
  // Property 'relation' does not exist on type 'Graph'.
  projects: Project,
};
// const jwt = auth.JWT({
//   issuer: "grafbase",
//   secret: g.env("NEXTAUTH_SECRET"),
// });

export default config({
  graph: g,
  auth: {
    // providers: [jwt],
    rules: (rules) => rules.private(),
  },
});
