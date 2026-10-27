// Tracks content

export const WORLDS = {
  software: {
    key: "software",
    code: "WORLD 01",
    name: "SOFTWARE",
    acc: "#ff3b6c",
    innerCount: 4, // first 4 tracks orbit on the inner ring, the rest on the outer one
  },
  hardware: {
    key: "hardware",
    code: "WORLD 02",
    name: "HARDWARE",
    acc: "#38bdf8",
    innerCount: 2,
  },
};

export const TRACKS = {
  software: [
    {
      id: "s1",
      name: "HealthTech",
      desc: "Digital care, diagnostics and patient wellbeing.", // draft
      icon: "health",
    },
    {
      id: "s2",
      name: "FinTech",
      desc: "Payments, banking and financial inclusion.", // draft
      icon: "fin",
    },
    {
      id: "s3",
      name: "Education",
      desc: "Learning tools and wider access to education.", // draft
      icon: "edu",
    },
    {
      id: "s4",
      name: "Web3 & Blockchain",
      desc: "Decentralised apps, contracts and on-chain systems.", // draft
      icon: "web3",
    },
    {
      id: "s5",
      name: "E-Sports",
      desc: "Competitive gaming platforms and player experience.", // draft
      icon: "esports",
    },
    {
      id: "s6",
      name: "Women's Safety",
      desc: "Safety, support and emergency response for women.", // draft
      icon: "safety",
    },
    {
      id: "s7",
      name: "Security",
      desc: "Cybersecurity, privacy and trustworthy systems.", // draft
      icon: "security",
    },
    {
      id: "s8",
      name: "Sustainability",
      // confirmed wording, reused from the hardware world
      desc: "Climate-conscious and eco-friendly innovations.",
      icon: "sustain",
    },
    {
      id: "s9",
      name: "Open Innovation",
      // confirmed wording, reused from the hardware world
      desc: "Build anything innovative beyond the defined tracks; bring your own unique idea to life.",
      icon: "open",
    },
  ],
  hardware: [
    {
      id: "h1",
      name: "IoT",
      desc: "Connected devices and intelligent systems.",
      icon: "iot",
    },
    {
      id: "h2",
      name: "AgriTech",
      desc: "Technology for modern agriculture and farming.",
      icon: "agri",
    },
    {
      id: "h3",
      name: "Smart City & Civic Tech",
      desc: "Urban infrastructure and governance solutions.",
      icon: "city",
    },
    {
      id: "h4",
      name: "Sustainability",
      desc: "Climate-conscious and eco-friendly innovations.",
      icon: "sustain",
    },
    {
      id: "h5",
      name: "Open Innovation",
      desc: "Build anything innovative beyond the defined tracks; bring your own unique idea to life.",
      icon: "open",
    },
  ],
};

export const OTHER_WORLD = { software: "hardware", hardware: "software" };
