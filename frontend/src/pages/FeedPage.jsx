import Container from "react-bootstrap/Container";
import NavigationBar from "../components/NavigationBar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FeedCards from "../components/FeedCards.jsx";
import "../css/FeedPage.css";

export default function FeedPage() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingById, setLikingById] = useState({});
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentFollowing, setCurrentFollowing] = useState([]);
  const [feedView, setFeedView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      setError("");

      try {
        const [feedRes, userRes] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/auth/user"),
        ]);

        if (feedRes.status === 401 || userRes.status === 401) {
          navigate("/");
          return;
        }

        if (!feedRes.ok) {
          setError("Could not load the feed right now.");
          return;
        }

        const feedData = await feedRes.json();
        setItineraries(feedData.itineraries ?? []);

        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUsername(userData?.user?.username ?? "");
          setCurrentFollowing(
            Array.isArray(userData?.user?.following) ? userData.user.following : [],
          );
        }
      } catch {
        setError("Could not load the feed right now.");
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [navigate]);

  const handleLike = async (itineraryId) => {
    setLikingById((prev) => ({ ...prev, [itineraryId]: true }));

    try {
      const res = await fetch(`/api/feed/${itineraryId}/like`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      if (res.status === 401) {
        navigate("/");
        return;
      }

      if (!res.ok) return;

      const data = await res.json();
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary._id === itineraryId
            ? { ...itinerary, likes: data.likes, liked: data.liked }
            : itinerary,
        ),
      );
    } catch {
      // Keep current UI state if request fails.
    } finally {
      setLikingById((prev) => ({ ...prev, [itineraryId]: false }));
    }
  };



  const normalizedQuery = searchQuery.trim().toLowerCase();
  const followedItineraries = itineraries.filter((itinerary) => {
    const collaborators = Array.isArray(itinerary.collaborators)
      ? itinerary.collaborators
      : [];

    return (
      currentFollowing.includes(itinerary.creator) ||
      collaborators.some((name) => currentFollowing.includes(name))
    );
  });

  const baseItineraries = feedView === "all" ? itineraries : followedItineraries;
  const searchSourceItineraries = normalizedQuery ? itineraries : baseItineraries;

  const filteredItineraries = searchSourceItineraries.filter((itinerary) => {
    if (!normalizedQuery) return true;

    const collaborators = Array.isArray(itinerary.collaborators)
      ? itinerary.collaborators.join(" ")
      : "";
    const location = [itinerary.city ?? itinerary.cityRegion, itinerary.country]
      .filter(Boolean)
      .join(" ");

    const searchableText = [
      itinerary.title,
      itinerary.caption,
      itinerary.theme,
      itinerary.creator,
      collaborators,
      location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <>
      <NavigationBar />
      <div className="feed-page">
      <Container>
        <h1 className="feed-page-title">Your Feed</h1>
        <p className="feed-page-description">
          Explore the latest itineraries from people you follow, or explore the whole community of travelers.
        </p>

        {!loading && !error && (
          <div className="feed-view-toggle" role="group" aria-label="Feed view">
            <button
              type="button"
              className={`feed-view-btn${feedView === "followed" ? " is-active" : ""}`}
              onClick={() => setFeedView("followed")}
            >
              Following
            </button>
            <button
              type="button"
              className={`feed-view-btn${feedView === "all" ? " is-active" : ""}`}
              onClick={() => setFeedView("all")}
            >
              All Users
            </button>
          </div>
        )}

        {!loading && !error && currentUsername && (
          <div className="feed-search-wrap">
            <label className="feed-search-label" htmlFor="feed-search-input">
              Search itineraries
            </label>
            <input
              id="feed-search-input"
              type="search"
              className="feed-search-input"
              placeholder="Search by title, caption, theme, location, or username"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        )}


        {loading && <p>Loading itineraries...</p>}
        {!loading && error && <p>{error}</p>}

        {!loading && !error && baseItineraries.length === 0 && (
          <p>
            {feedView === "all"
              ? "No itineraries yet."
              : "No itineraries yet from people you follow."}
          </p>
        )}

        {!loading && !error && baseItineraries.length > 0 && filteredItineraries.length === 0 && (
          <p>No matching itineraries for your search.</p>
        )}

        {!loading && !error && filteredItineraries.length > 0 && (
          <div className="feed-list">
            {filteredItineraries.map((itinerary) => (
              <FeedCards
                key={itinerary._id}
                itinerary={itinerary}
                onLike={handleLike}
                isLiking={Boolean(likingById[itinerary._id])}
              />
            ))}
          </div>
        )}
      </Container>
      </div>
    </>
  );
}
