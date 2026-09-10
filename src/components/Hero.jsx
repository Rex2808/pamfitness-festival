import Countdown from "./Countdown";

function Hero({ festival }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.55),
          rgba(0, 0, 0, 0.7)
        ), url(${festival.hero_image_url})`,
      }}
    >
      <div className="hero-content">
        <p className="hero-theme">{festival.theme}</p>

        <h1>{festival.name}</h1>

        <p className="hero-details">
          {festival.event_date} • {festival.start_time}
        </p>

       <p className="hero-location">
          {festival.venue}

           <br />
           {festival.address}
          </p>

        <div className="hero-actions">
          <a href="#register" className="btn btn-primary">
            REGISTER FOR FREE
          </a>

          <a href="#vest" className="btn btn-secondary">
            GET YOUR VEST
          </a>
        </div>

        <Countdown festival={festival} />
      </div>
    </section>
  );
}

export default Hero;