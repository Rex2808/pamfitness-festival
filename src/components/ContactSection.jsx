import {
  MapPin,
  CalendarDays,
  Clock,
  MessageCircle,
  Phone,
} from "lucide-react";

function ContactSection({ festival }) {
  const eventDate = new Date(`${festival.event_date}T00:00:00`);

  const formattedDate = eventDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(
    `1970-01-01T${festival.start_time}`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const displayPhone = festival.whatsapp.startsWith("234")
    ? `0${festival.whatsapp.slice(3)}`
    : festival.whatsapp;

  const whatsappUrl = `https://wa.me/${festival.whatsapp}`;

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <div className="contact-header">
          <p className="section-eyebrow">FIND US</p>

          <h2>
            COME BE PART OF THE
            <span> EXPERIENCE.</span>
          </h2>

          <p>
           Everything you need to know about when and where
           {festival.name} is happening.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-location">
            <div className="contact-icon">
              <MapPin size={28} />
            </div>

            <p className="contact-label">VENUE</p>

            <h3>{festival.venue}</h3>

          
          </div>

          <div className="contact-details">
            <div className="contact-detail">
              <CalendarDays size={22} />

              <div>
                <span>DATE</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <div className="contact-detail">
              <Clock size={22} />

              <div>
                <span>TIME</span>
                <strong>{formattedTime}</strong>
              </div>
            </div>

            <div className="contact-detail">
              <Phone size={22} />

              <div>
                <span>PHONE</span>
                <strong>{displayPhone}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <MessageCircle size={20} />
            CHAT ON WHATSAPP
          </a>

          <a
            href={festival.facebook_url}
            target="_blank"
            rel="noreferrer"
            className="contact-social"
          >
            <span>F</span>
            FACEBOOK
          </a>

          <a
            href={festival.instagram_url}
            target="_blank"
            rel="noreferrer"
            className="contact-social"
          >
            <span>IG</span>
            INSTAGRAM
          </a>

          <a
            href={festival.tiktok_url}
            target="_blank"
            rel="noreferrer"
            className="contact-social"
          >
            <span>TT</span>
            TIKTOK
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;