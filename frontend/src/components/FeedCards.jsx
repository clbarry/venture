import "../css/FeedCards.css";

function planToDays(itinerary) {
  if (!itinerary.plan || typeof itinerary.plan !== "object") return [];
  return Object.values(itinerary.plan);
}

export default function FeedCards({ itinerary }) {
  const {
    caption,
    title,
    creator,
    theme,
    city,
    cityRegion,
    country,
    collaborators,
    family_friendly,
  } = itinerary;

  const location = [city ?? cityRegion, country].filter(Boolean).join(", ");
  const days = planToDays(itinerary);
  const dayCount = days.length;

  return (
    <article className="feed-cards mb-3">
      <div className="feed-cards-header">
        <div className="feed-cards-header-row">
          <div className="feed-cards-heading-group">
            <div className="feed-cards-theme">
              {theme && <span className="feed-cards-chip">{theme}</span>}
            </div>

            <h2 className="feed-cards-title">
              {title || "Untitled itinerary"}
            </h2>

            <h3 className="feed-cards-caption">
              {caption || "Untitled itinerary"}
            </h3>
          </div>

          {location && (
            <span className="feed-cards-chip feed-cards-location-chip">
              {location}
            </span>
          )}
          <div className="feed-cards-meta">
            {dayCount > 0 && (
              <span className="feed-cards-chip">
                {dayCount} day{dayCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="feed-cards-body">
        <div className="feed-cards-meta">
          {creator && <span className="feed-cards-chip">from @{creator}</span>}
        </div>

        {Array.isArray(collaborators) && collaborators.length > 0 && (
          <p className="feed-cards-collaborators">
            Collaborators: {collaborators.map((u) => `@${u}`).join(", ")}
          </p>
        )}

        {planToDays(itinerary).map((activities, dayIndex) => (
          <section className="feed-cards-day" key={dayIndex}>
            <h3 className="feed-cards-day-title feed-cards-day-pill">
              Day {dayIndex + 1}
            </h3>
            <ul className="feed-cards-activities">
              {activities.map((activity, activityIndex) => (
                <li key={activityIndex}>{activity}</li>
              ))}
            </ul>
          </section>
        ))}
        {family_friendly && <p className="feed-cards-note">Family-friendly</p>}
      </div>
    </article>
  );
}
