type PageHeroProps = {
  eyebrow?: string;
  title: string;
  text: string;
};

export default function PageHero({ eyebrow, title, text }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p className="lead">{text}</p>
      </div>
    </section>
  );
}
