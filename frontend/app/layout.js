import { Orbitron, Inter } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "Vihaan X | North India's Largest Student-Run Hackathon | IEEE DTU",
  description: "The 10th edition of North India's largest student-run hackathon, presented by IEEE DTU.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#070b19] text-white font-sans antialiased selection:bg-[#ff3b6c] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
