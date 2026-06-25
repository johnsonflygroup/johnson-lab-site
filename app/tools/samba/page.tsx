import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import HeroActions from "@/components/HeroActions";
import ImagePanel from "@/components/ImagePanel";

export default function SambaPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Tools"
          title="SAM2 Behavioural Analysis Software"
          text="User-friendly pipeline for analysing locomotion and behaviour"
        />
        <HeroActions />
        <section className="section">
          <div className="container grid two">
            <article className="card pad">
              <h2>SAMBA</h2>
              <p>
                SAMBA (SAM2 for Behavioural Analysis) is a user-friendly analysis pipeline for analysing locomotion patterns in model organisms, particualrly Drosophila melanogaster larvae.
              </p>
              <h3>Getting started</h3>
              <p>
                Save a copy of SAMBA to a Google Drive account. Upload video files (.mp4, .mov, .avi, .mkv) to be analysed to the same Google Drive account. Folder directories will be generated automatically during the set-up process. The analysis output data will also be written to Google Drive.
              </p>

              <h3>Sample videos</h3>
              <p>
                Short 10s sample videos (in the <a href="https://github.com/johnsonflygroup/SAMBA/tree/main/sample_videos" target="_blank" rel="noopener noreferrer">sample_videos</a> folder) are included in this repository to test run SAMBA for yourself.
              </p>

              <p>
                <strong>Where to put them:</strong> After Step 2.2, Set Main Directory is run for the first time, upload videos to the <code>data</code> folder at your specified directory in Google Drive.
              </p>

              <p>
                <strong>Please cite</strong> <em>Mele et al., 2026. Disease Models &amp; Mechanisms.</em> See the <a href="/publications">publications page</a> for the full citation and DOI.
              </p>
              <div className="button-row">
                <a className="button" href="https://github.com/johnsonflygroup/SAMBA" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a className="button" href="https://colab.research.google.com/github/johnsonflygroup/SAMBA/blob/main/SAMBA_SAM2_Behavioural_Analysis.ipynb" target="_blank" rel="noopener noreferrer" aria-label="Open in Colab">
                  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab" style={{height:24}} />
                </a>
              </div>
            </article>
            <div className="full-image">
              <ImagePanel src="/images/SAMBA logo.png" label="" />
              <figure className="video-card">
                <video
                  src="/images/Example 10x speed.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
                <figcaption>SAMBA tracking of Drosophila larval locomotion (10x speed). </figcaption>
              </figure>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
