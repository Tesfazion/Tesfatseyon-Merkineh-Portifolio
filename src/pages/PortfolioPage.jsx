/**
 * PortfolioPage — renders the correct service mode (web / video).
 *
 * Section order:
 *   Hero → About → Resume → Skills → Services → Work → Contact
 *
 * The mode accent is set centrally in App.jsx from the route
 * (useMode in Shell), so it is not repeated here.
 */
import { PortfolioProvider } from "../PortfolioProvider";
import { modes } from "../config";
import Seo             from "../components/Seo";
import Navbar       from "../components/Navbar";
import Hero         from "../components/Hero";
import About        from "../components/About";
import Resume       from "../components/Resume";
import TechStack    from "../components/TechStack";
import Services     from "../components/Services";
import Projects     from "../components/Projects";
import Contact      from "../components/Contact";
import Footer       from "../components/Footer";
import FabControls  from "../components/FabControls";
import StickyCTA    from "../components/StickyCTA";
import { breadcrumbSchema } from "../lib/schema";

export default function PortfolioPage({ modeKey }) {
  const mode = modes[modeKey] || modes.web;

  return (
    <PortfolioProvider modeKey={modeKey}>
      <Seo
        title={mode.seo.title}
        description={mode.seo.description}
        path={mode.route}
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: mode.label || mode.seo.title, path: mode.route },
        ])}
      />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Resume />
        <TechStack />
        <Services />
        <Projects />
        <Contact />
      </main>

      <Footer />
      <FabControls />
      <StickyCTA />
    </PortfolioProvider>
  );
}