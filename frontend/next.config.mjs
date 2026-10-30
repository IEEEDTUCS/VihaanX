import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/wa",
        destination: "https://chat.whatsapp.com/LOuOW4gzGJFAE3OdheHVQw",
        permanent: true,
      },
      {
        source: "/register",
        destination:
          "https://unstop.com/college-fests/vihaan-x-ieee-dtu-delhi-technological-university-dtu-new-delhi-519244",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
