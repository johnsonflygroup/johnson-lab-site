import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import PublicationList from "@/components/PublicationList";
import { getPublications } from "@/lib/pubmed";
import HeroActions from "@/components/HeroActions";

export default async function PublicationsPage() {
  const publications = await getPublications(25);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Outputs"
          title="Publications"
          text="Explore our latest work in disease models, imaging, and translational metabolic research."
        />
        <HeroActions />
        <section className="section">
          <div className="container">
            <PublicationList publications={publications} />
          </div>
        </section>
      </main>
    </>
  );
}
