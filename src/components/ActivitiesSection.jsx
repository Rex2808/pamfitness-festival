function ActivitiesSection({ activities }) {
  return (
    <section className="activities-section" id="activities">
      <div className="section-container">
        <div className="activities-header">
          <div>
            <p className="section-eyebrow">WHAT'S HAPPENING</p>

            <h2>
              MOVE.
              <span> CONNECT.</span>
              <br />
              CELEBRATE.
            </h2>
          </div>

          <p className="activities-intro">
            From high-energy workouts to wellness, games and
            meaningful connections, the festival brings together
            experiences for every kind of participant.
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity) => (
            <article
              className="activity-card"
              key={activity.id}
            >
              <div className="activity-number">
                {String(activity.display_order).padStart(2, "0")}
              </div>

              <div className="activity-card-content">
                <h3>{activity.name}</h3>

                <p>{activity.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActivitiesSection;