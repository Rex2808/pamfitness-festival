function AboutSection({ festival }) {
  return (
    <section className="about-section" id="about">
      <div className="section-container">
        <div className="about-heading">
          <p className="section-eyebrow">THE FESTIVAL</p>

          <h2>
            MORE THAN
            <span> FITNESS.</span>
          </h2>
        </div>

        <div className="about-content">
          <div className="about-theme">
            <span>BODY</span>
            <span>MIND</span>
            <span>SOUL</span>
          </div>

          <div className="about-text">
            <p className="about-lead">
              {festival.name} is a celebration of movement,
              wellness, community and healthy living.
            </p>

            <p>
              Built around the philosophy of Body, Mind & Soul,
              the festival brings people together through fitness,
              wellness, education, entertainment and meaningful
              connections.
            </p>

            <p>
              Whether you come to run, stretch, dance, learn,
              connect or simply have fun, there is something for
              everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;