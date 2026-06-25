import SiteHeader from "@/components/SiteHeader";
import HeroActions from "@/components/HeroActions";

export default function IntegrativeToolPage() {
  return (
    <>
      <SiteHeader />

      <main className="tool-only-page">
        <HeroActions />
        <iframe
          src="https://dekai-imd-model-tool.shinyapps.io/shiny-1/"
          title="Integrative IMD Model Organism Explorer"
          className="tool-only-iframe"
        />
      </main>
    </>
  );
}