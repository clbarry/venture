import Container from "react-bootstrap/Container";
import NavigationBar from "../components/NavigationBar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FeedCards from "../components/FeedCards.jsx";
import "../css/FeedPage.css";

function shuffleList(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

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
  const [daysFilter, setDaysFilter] = useState("all");
  const [shuffledIds, setShuffledIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);

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
            Array.isArray(userData?.user?.following)
              ? userData.user.following
              : [],
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

  const likedItineraries = itineraries.filter((itinerary) =>
    Boolean(itinerary.liked),
  );
  const baseItineraries =
    feedView === "all"
      ? itineraries
      : feedView === "liked"
        ? likedItineraries
        : followedItineraries;
  const searchSourceItineraries = normalizedQuery
    ? itineraries
    : baseItineraries;

  useEffect(() => {
    setShuffledIds(shuffleList(baseItineraries).map((it) => it._id));
    setVisibleCount(25);
  }, [feedView, currentFollowing, itineraries.length]);

  useEffect(() => {
    setVisibleCount(25);
  }, [normalizedQuery]);

  useEffect(() => {
    setVisibleCount(25);
  }, [daysFilter]);

  const matchesDays = (itinerary) => {
    if (daysFilter === "all") return true;
    const days =
      Number(itinerary.num_days) ||
      Number(itinerary.day_count) ||
      Object.keys(itinerary.plan ?? {}).length;
    return days === Number(daysFilter);
  };

  const filteredItineraries = searchSourceItineraries.filter((itinerary) => {
    if (!matchesDays(itinerary)) return false;
    if (!normalizedQuery) return true;
    const collaborators = Array.isArray(itinerary.collaborators)
      ? itinerary.collaborators.join(" ")
      : "";
    const location = [itinerary.city ?? itinerary.cityRegion, itinerary.country]
      .filter(Boolean)
      .join(" ");

    const planText = Object.values(itinerary.plan ?? {})
      .flat()
      .join(" ");

    const tips = Array.isArray(itinerary.tips) ? itinerary.tips.join(" ") : "";

    const searchableText = [
      itinerary.title,
      itinerary.caption,
      itinerary.theme,
      itinerary.creator,
      collaborators,
      location,
      planText,
      tips,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  const randomizedBaseItineraries = shuffledIds
    .map((id) => baseItineraries.find((it) => it._id === id))
    .filter(Boolean);

  const sourceItineraries = normalizedQuery
    ? filteredItineraries
    : randomizedBaseItineraries.filter(matchesDays);

  const displayedItineraries = sourceItineraries.slice(0, visibleCount);

  const canLoadMore = displayedItineraries.length < sourceItineraries.length;

  return (
    <>
      <NavigationBar />
      <div className="feed-page">
        <Container>
          <h1 className="feed-page-title">Travel Feed</h1>
          <p className="feed-page-description">
            Explore itineraries from people you follow, liked itineraries, or
            explore the whole community of travelers.
          </p>

          {!loading && !error && (
            <div
              className="feed-view-toggle"
              role="group"
              aria-label="Feed view"
            >
              <button
                type="button"
                className={`feed-view-btn${feedView === "all" ? " is-active" : ""}`}
                onClick={() => setFeedView("all")}
              >
                All Users
              </button>

              <button
                type="button"
                className={`feed-view-btn${feedView === "followed" ? " is-active" : ""}`}
                onClick={() => setFeedView("followed")}
              >
                Following
              </button>

              <button
                type="button"
                className={`feed-view-btn${feedView === "liked" ? " is-active" : ""}`}
                onClick={() => setFeedView("liked")}
              >
                Liked Itineraries
              </button>
            </div>
          )}

          {!loading && !error && currentUsername && (
            <div className="feed-filters-row">
              <div className="feed-search-wrap">
                <label
                  className="feed-search-label"
                  htmlFor="feed-search-input"
                >
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

              <div className="feed-days-wrap">
                <label className="feed-search-label" htmlFor="feed-days-select">
                  Days
                </label>
                <select
                  id="feed-days-select"
                  className="feed-days-select"
                  value={daysFilter}
                  onChange={(event) => setDaysFilter(event.target.value)}
                >
                  <option value="all">All</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "day" : "days"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div>
            <p className="feed-card-instructions">
              Click on an itinerary card to view more details.
            </p>
          </div>

          {loading && <p>Loading itineraries...</p>}
          {!loading && error && <p>{error}</p>}

          {!loading && !error && baseItineraries.length === 0 && (
            <p>
              {feedView === "all"
                ? "No itineraries yet."
                : feedView === "liked"
                  ? "No liked itineraries yet."
                  : "No itineraries yet from people you follow."}
            </p>
          )}

          {!loading &&
            !error &&
            baseItineraries.length > 0 &&
            filteredItineraries.length === 0 && (
              <p>No matching itineraries for your search.</p>
            )}

          {!loading && !error && displayedItineraries.length > 0 && (
            <div className="row g-4 feed-list">
              {displayedItineraries.map((itinerary) => (
                <div className="col-12 col-md-6 col-xl-4" key={itinerary._id}>
                  <FeedCards
                    itinerary={itinerary}
                    onLike={handleLike}
                    isLiking={Boolean(likingById[itinerary._id])}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && displayedItineraries.length > 0 && (
            <p className="text-center mt-3 mb-2">
              Showing {displayedItineraries.length} of{" "}
              {sourceItineraries.length}
            </p>
          )}

          {!loading && !error && canLoadMore && (
            <div className="d-flex justify-content-center mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setVisibleCount((prev) => prev + 25)}
              >
                Load More Itineraries
              </button>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
