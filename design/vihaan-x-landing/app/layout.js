import "./globals.css";

export const metadata = {
  title: "VIHAAN X | DTU IEEE Student Branch",
  description: "The 10th edition of North India's largest student-run hackathon."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
