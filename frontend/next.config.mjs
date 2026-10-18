import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      // Add permanent or temporary URL redirects here as Vihaan grows.
      // { source: '/register', destination: 'https://example.com', permanent: false },
      {
        source: '/wa',
        destination: 'https://chat.whatsapp.com/LhXp4DQOVgEIP6yxeeY37V',
        permanent: true,
      },
      {
        source: '/register',
        destination: 'https://unstop.com/college-fests/vihaan-x-ieee-dtu-delhi-technological-university-dtu-new-delhi-519244',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
