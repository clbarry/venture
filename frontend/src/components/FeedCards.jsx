import PropTypes from "prop-types";
import Accordion from "react-bootstrap/Accordion";
import "../css/FeedCards.css";

function planToDays(itinerary) {
  if (!itinerary.plan || typeof itinerary.plan !== "object") return [];
  return Object.values(itinerary.plan);
}

export default function FeedCards({ itinerary, onLike, isLiking = false }) {
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
    tips,
  } = itinerary;

  const location = [city ?? cityRegion, country].filter(Boolean).join(", ");
  const days = planToDays(itinerary);
  const dayCount = days.length;
  const likeCount = Number(itinerary.likes) || 0;
  const hasLiked = Boolean(itinerary.liked);

  return (
    <article className="feed-cards mb-3">
      <Accordion defaultActiveKey={null}>
        <Accordion.Item eventKey="0" flush={true} collapse="true">
          <Accordion.Header className="accordion accordion-header">
            <div className="feed-cards-header">
              <div className="feed-cards-header-row">
                <div className="feed-cards-heading-group">
                  <div className="feed-cards-header-top-row">
                    <div className="feed-cards-theme">
                      {theme && (
                        <span className="feed-cards-chip">{theme}</span>
                      )}
                    </div>

                    <div className="feed-cards-location">
                      {location && (
                        <span className="feed-cards-chip feed-cards-location-chip">
                          {location}
                        </span>
                      )}
                    </div>

                    <div className="feed-cards-days">
                      {dayCount > 0 && (
                        <span className="feed-cards-chip">
                          {dayCount} day{dayCount === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="feed-cards-title">
                    {title || "Untitled itinerary"}
                  </h2>

                  <h3 className="feed-cards-caption">
                    {caption || "No caption provided."}
                  </h3>

                  <div className="feed-cards-meta">
                    <div className="feed-cards-meta">
                      <button
                        type="button"
                        className={`btn btn-sm feed-cards-like-btn${hasLiked ? " is-liked" : ""}`}
                        onClick={() => onLike?.(itinerary._id)}
                        disabled={isLiking}
                      >
                        <img
                          src="/likes.png"
                          alt="thumbs up like emoji"
                          width="16"
                          height="16"
                          className={`feed-cards-like-icon${hasLiked ? " is-liked" : ""}`}
                        />
                        {isLiking
                          ? "Updating..."
                          : hasLiked
                            ? `${likeCount - 1 === 1 ? "liked by you" : `you and ${likeCount - 1} others`}`
                            : `${likeCount} like${likeCount === 1 ? "" : "s"}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body className="accordion-body">
            <div className="feed-cards-body">
              <div className="feed-cards-meta">
                {creator && (
                  <span className="feed-cards-chip">from @{creator}</span>
                )}
                {family_friendly && (
                  <span className="feed-cards-chip feed-cards-chip-family-friendly">
                    Family-friendly
                  </span>
                )}
              </div>

              <div className="feed-cards-tips-section">
                {tips && (
                  <p className="feed-cards-tips">
                    <strong>Travel tips:</strong> {tips}
                  </p>
                )}
              </div>

              <div className="feed-cards-days-section">
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
              </div>

              <div className="feed-cards-collaborators-section">
                {Array.isArray(collaborators) && collaborators.length > 0 && (
                  <p className="feed-cards-collaborators">
                    Collaborators:{" "}
                    {collaborators.map((u) => `@${u}`).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </article>
  );
}

FeedCards.propTypes = {
  itinerary: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    caption: PropTypes.string,
    title: PropTypes.string,
    creator: PropTypes.string,
    theme: PropTypes.string,
    city: PropTypes.string,
    cityRegion: PropTypes.string,
    country: PropTypes.string,
    collaborators: PropTypes.arrayOf(PropTypes.string),
    family_friendly: PropTypes.bool,
    tips: PropTypes.string,
    plan: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    likes: PropTypes.number,
    liked: PropTypes.bool,
  }).isRequired,
  onLike: PropTypes.func,
  isLiking: PropTypes.bool,
};
