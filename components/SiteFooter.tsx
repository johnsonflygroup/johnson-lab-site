import Link from "next/link";
import { contactDetails } from "@/lib/site-data";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Johnson Lab</h3>
          <p>
            <a href="https://www.latrobe.edu.au/lims" target="_blank" rel="noopener noreferrer">
              {contactDetails.institute}
            </a>
          </p>
          <p>
            <a href="https://www.latrobe.edu.au/" target="_blank" rel="noopener noreferrer">
              {contactDetails.university}
            </a>
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <p>
            <Link href="/team">Team</Link> · <Link href="/tools">Tools</Link> ·{" "}
            <Link href="/publications">Publications</Link> · <Link href="/contact">Contact</Link>
          </p>
          <p>Email: <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></p>
        </div>
        <div className="footer-lims-logo">
          <a href="https://www.latrobe.edu.au/lims" target="_blank" rel="noopener noreferrer">
            <img src="/images/LTU LIMS.png" alt="La Trobe Institute for Molecular Science" />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {year} Johnson Lab. All rights reserved.</p>
      </div>
    </footer>
  );
}
