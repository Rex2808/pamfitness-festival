function GallerySection({ gallery }) {
  return (
    <section className="gallery-section" id="gallery">
      <div className="section-container">
        <div className="gallery-header">
          <p className="section-eyebrow">THE EXPERIENCE</p>

          <h2>
            SEE THE
            <span> ENERGY.</span>
          </h2>

          <p>
            A glimpse of the movement, community and experiences
            that make PAMFITNESS FESTIVAL special.
          </p>
        </div>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <article className="gallery-card" key={item.id}>
              <img
                src={item.image_url}
                alt={item.caption || "PAMFITNESS Festival"}
              />

              {item.caption && (
                <div className="gallery-caption">
                  {item.caption}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;