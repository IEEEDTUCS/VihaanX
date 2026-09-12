// Home page — assembles every section of the site in scroll order
import Navbar from "../components/Navbar/Navbar.jsx";
import Landing from "../components/Landing/Landing.jsx";
import About from "../components/About/About.jsx";
import Gallery from "../components/Gallery/Gallery.jsx";
import Tracks from "../components/Tracks/Tracks.jsx";
import Prizes from "../components/Prizes/Prizes.jsx";
import Sponsors from "../components/Sponsors/Sponsors.jsx";
import Team from "../components/Team/Team.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Landing />
        <About />
        <Gallery />
        <Tracks />
        <Prizes />
        <Sponsors />
        <Team />
      </main>
      <Footer />
    </>
  );
}
