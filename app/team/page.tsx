import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import HeroActions from "@/components/HeroActions";
import { contactDetails, teamMembers } from "@/lib/site-data";

function BioParagraph({ text }: { text: string }) {
  if (!text) return null;

  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

export default function TeamPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Team"
          title="People in the Johnson Lab"
          text="Meet the researchers and collaborators shaping our lab’s work."
        />
        <HeroActions />
        <section className="section">
          <div className="container grid two team-grid">
            <article className="card pad team-card team-card--lead" key={teamMembers[0].name}>
              {teamMembers[0].image ? (
                <img className="team-photo" src={teamMembers[0].image} alt={teamMembers[0].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[0].name}</h3>
                <span className="tag">{teamMembers[0].role}</span>
                <p><strong>{teamMembers[0].project}</strong></p>
                <BioParagraph text={teamMembers[0].bio} />
              </div>
            </article>

            <article className="card pad team-card" key={teamMembers[1].name}>
              {teamMembers[1].image ? (
                <img className="team-photo" src={teamMembers[1].image} alt={teamMembers[1].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[1].name}</h3>
                <span className="tag">{teamMembers[1].role}</span>
                <p><strong>{teamMembers[1].project}</strong></p>
                <BioParagraph text={teamMembers[1].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[2].name}>
              {teamMembers[2].image ? (
                <img className="team-photo" src={teamMembers[2].image} alt={teamMembers[2].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[2].name}</h3>
                <span className="tag">{teamMembers[2].role}</span>
                <p><strong>{teamMembers[2].project}</strong></p>
                <BioParagraph text={teamMembers[2].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[3].name}>
              {teamMembers[3].image ? (
                <img className="team-photo" src={teamMembers[3].image} alt={teamMembers[3].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[3].name}</h3>
                <span className="tag">{teamMembers[3].role}</span>
                <p><strong>{teamMembers[3].project}</strong></p>
                <BioParagraph text={teamMembers[3].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[4].name}>
              {teamMembers[4].image ? (
                <img className="team-photo" src={teamMembers[4].image} alt={teamMembers[4].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[4].name}</h3>
                <span className="tag">{teamMembers[4].role}</span>
                <p><strong>{teamMembers[4].project}</strong></p>
                <BioParagraph text={teamMembers[4].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[5].name}>
              {teamMembers[5].image ? (
                <img className="team-photo" src={teamMembers[5].image} alt={teamMembers[5].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[5].name}</h3>
                <span className="tag">{teamMembers[5].role}</span>
                <p><strong>{teamMembers[5].project}</strong></p>
                <BioParagraph text={teamMembers[5].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[6].name}>
              {teamMembers[6].image ? (
                <img className="team-photo" src={teamMembers[6].image} alt={teamMembers[6].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[6].name}</h3>
                <span className="tag">{teamMembers[6].role}</span>
                <p><strong>{teamMembers[6].project}</strong></p>
                <BioParagraph text={teamMembers[6].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[7].name}>
              {teamMembers[7].image ? (
                <img className="team-photo" src={teamMembers[7].image} alt={teamMembers[7].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[7].name}</h3>
                <span className="tag">{teamMembers[7].role}</span>
                <p><strong>{teamMembers[7].project}</strong></p>
                <BioParagraph text={teamMembers[7].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[8].name}>
              {teamMembers[8].image ? (
                <img className="team-photo" src={teamMembers[8].image} alt={teamMembers[8].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[8].name}</h3>
                <span className="tag">{teamMembers[8].role}</span>
                <p><strong>{teamMembers[8].project}</strong></p>
                <BioParagraph text={teamMembers[8].bio} />
              </div>
            </article>
            <article className="card pad team-card" key={teamMembers[9].name}>
              {teamMembers[9].image ? (
                <img className="team-photo" src={teamMembers[9].image} alt={teamMembers[9].name} />
              ) : (
                <div className="placeholder-photo">Photo</div>
              )}
              <div>
                <h3>{teamMembers[9].name}</h3>
                <span className="tag">{teamMembers[9].role}</span>
                <p><strong>{teamMembers[9].project}</strong></p>
                <BioParagraph text={teamMembers[9].bio} />
              </div>
            </article>
            <article className="card image-card team-photo-card" key="team-outside-image">
              <img src="/images/team-outside.jpg" alt="Team outside" />
              <div className="caption">AusFly 2025, Marysville</div>
            </article>
            <article className="card pad team-card team-card--join">
              <div>
                <h3>Interested in joining the team?</h3>
                <p>
                  Email <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a> to discuss research and training opportunities in rare metabolic disease.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
