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

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/feed");

        if (res.status === 401) {
          navigate("/");
          return;
        }

        if (!res.ok) {
          setError("Could not load the feed right now.");
          return;
        }

        const data = await res.json();
        setItineraries(data.itineraries ?? []);
      } catch {
        setError("Could not load the feed right now.");
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [navigate]);

  return (
    <>
      <NavigationBar />
      <div className="feed-page">
      <Container>
        <h1 className="feed-page-title">Your Feed</h1>
        <p className="feed-page-description">
          Explore the latest itineraries from people you follow, or explore the whole community of travelers.
        </p>


        {loading && <p>Loading itineraries...</p>}
        {!loading && error && <p>{error}</p>}

        {!loading && !error && itineraries.length === 0 && (
          <p>No itineraries yet. Be the first to publish one.</p>
        )}

        {!loading && !error && itineraries.length > 0 && (
          <div className="feed-list">
            {itineraries.map((itinerary) => (
              <FeedCards key={itinerary._id} itinerary={itinerary} />
            ))}
          </div>
        )}
      </Container>
      </div>
    </>
  );
}
