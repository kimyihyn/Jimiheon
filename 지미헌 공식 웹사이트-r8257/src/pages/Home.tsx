import { Cuisine } from "../site/Cuisine";
import { Info } from "../site/Info";
import { Nav } from "../site/Nav";
import { Space } from "../site/Space";
import { Footer, Hero, Philosophy } from "../site/Story";
import { I18nProvider } from "../site/ui";

export default function Home() {
  return (
    <I18nProvider>
      <div className="jimiheon min-h-screen bg-[#F8F6F1] text-[#1C1B19]">
        <a href="#philosophy" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#F8F6F1] focus:px-4 focus:py-2">본문으로 건너뛰기</a>
        <Nav />
        <main>
          <Hero />
          <Philosophy />
          <Space />
          <Cuisine />
          <Info />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
