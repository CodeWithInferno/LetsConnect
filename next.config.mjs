/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["res.cloudinary.com", "my-cdn.com"],
          },
};

export default nextConfig;
