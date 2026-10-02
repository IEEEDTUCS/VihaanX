import './globals.css';

export const metadata = {
  title: "Vihaan X | North India's Largest Student-Run Hackathon | IEEE DTU",
  description: "The 10th edition of North India's largest student-run hackathon, presented by IEEE DTU.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
