import { Michroma, Cinzel } from 'next/font/google';
import './globals.css';

const michroma = Michroma({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-michroma',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

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
  return (
    <html lang="en" className={`${michroma.variable} ${cinzel.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/ethnocentric" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
