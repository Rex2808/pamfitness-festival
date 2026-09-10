function Footer({ festival }) {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">

          <div className="footer-brand">
            <img
              src="/images/pamfitness-logo.jpg"
              alt="PAMFITNESS"
              className="footer-logo"
            />

            <p className="footer-festival-name">
              {festival.name}
            </p>

            <p className="footer-theme">
              {festival.theme}
            </p>

            <p className="footer-description">
              A celebration of movement, wellness, community
              and healthy living.
            </p>
          </div>

          <div className="footer-links">
            <p className="footer-title">EXPLORE</p>

            <a href="#about">About</a>
            <a href="#activities">Activities</a>
            <a href="#gallery">Gallery</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-links">
            <p className="footer-title">JOIN</p>

            <a href="#register">Register Free</a>
            <a href="#vest">Get Your Vest</a>
            <a href="#vendors">Become a Vendor</a>
          </div>

          <div className="footer-contact">
            <p className="footer-title">CONTACT</p>

            <p>
              14, Westend Hospital Road, Off Airport Road,
              Bendel Estate, DDPA Ugborikoko, Effurun, Delta State
            </p>

            <a href="tel:080276645352">
              080276645352
            </a>

            <a href="tel:08182066411">
              08182066411
            </a>

            <a href="tel:08034551860">
              08034551860
            </a>

            <a href="tel:07011780762">
              07011780762
            </a>

            <a href="mailto:pamfitnesscentre@gmail.com">
              pamfitnesscentre@gmail.com
            </a>

            <a
              href={`https://wa.me/${festival.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp:{" "}
              {festival.whatsapp.startsWith("234")
                ? `0${festival.whatsapp.slice(3)}`
                : festival.whatsapp}
            </a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {festival.year} PAMFITNESS FESTIVAL. All rights reserved.
          </p>

          <p>
            BODY • MIND • SOUL
          </p>

          <p className="footer-powered">
            POWERED BY <strong>TrakLabs</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;