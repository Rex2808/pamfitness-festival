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

            <p>{festival.venue}</p>
            <p>{festival.address}</p>

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
    © {festival.year} {festival.name}. All rights reserved.
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