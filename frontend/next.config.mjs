/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Add permanent or temporary URL redirects here as Vihaan grows.
      // { source: '/register', destination: 'https://example.com', permanent: false },
      {
        source: '/wa',
        destination: 'https://chat.whatsapp.com/LhXp4DQOVgEIP6yxeeY37V',
        permanent: false,
      },
      {
        source: '/register',
        destination: 'https://unstop.com/college-fests/vihaan-x-ieee-dtu-delhi-technological-university-dtu-new-delhi-519244',
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
