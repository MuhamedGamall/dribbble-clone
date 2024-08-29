/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "task.com",
      "img.icons8.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    esmExternals: "loose",
  },
};

export default nextConfig;
