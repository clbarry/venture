import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import NavigationBar from "../components/NavigationBar.jsx";
import "../css/ProfilePage.css";
import FollowModal from "../components/FollowModal.jsx";

function planToDays(it) {
  if (!it.plan || typeof it.plan !== "object") return [];
  return Object.values(it.plan);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const onDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account? This removes all your itineraries and cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        navigate("/");
      } else {
        setDeleting(false);
        alert("Failed to delete account. Please try again.");
      }
    } catch {
      setDeleting(false);
      alert("Failed to delete account. Please try again.");
    }
  };

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      navigate("/");
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setProfile(data);
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (!profile) {
    return (
      <>
        <NavigationBar />
        <Container className="profile-loading">
          <h1 className="profile-name">Profile</h1>
          <div>Loading...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="profile-page">
        <Container className="profile-header text-center">
          <h1 className="profile-name">{profile.username}</h1>
          <p className="profile-handle">@{profile.username}</p>

          <div className="profile-stats">
            <span className="profile-stat">
              <strong>{profile.itineraries.length}</strong> itineraries
            </span>
            <button
              className="profile-stat profile-stat-btn"
              onClick={() => setModalMode("followers")}
            >
              <strong>{profile.followers.length}</strong> followers
            </button>
            <button
              className="profile-stat profile-stat-btn"
              onClick={() => setModalMode("following")}
            >
              <strong>{profile.following.length}</strong> following
            </button>
            <Button size="sm" onClick={() => setModalMode("follow")}>
              +
            </Button>
          </div>
        </Container>

        <Container className="profile-itineraries">
          {profile.itineraries.length === 0 ? (
            <div className="profile-empty">
              No itineraries yet. Create one to get started.
            </div>
          ) : (
            <div className="itinerary-columns">
              {profile.itineraries.map((it, i) => (
                <article
                  key={it._id}
                  className={`itinerary-card itinerary-accent-${i % 3}`}
                >
                  <h2 className="itinerary-title">{it.caption}</h2>

                  <div className="itinerary-meta">
                    <span className="itinerary-theme">{it.theme}</span>
                    {(it.city || it.country) && (
                      <span className="itinerary-location">
                        <img
                          src="/location.png"
                          alt="Location icon"
                          className="itinerary-pin"
                        />
                        {[it.city, it.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>

                  {it.collaborators?.length > 0 && (
                    <p className="itinerary-collab">
                      Collaborating with:{" "}
                      {it.collaborators.map((u) => `@${u}`).join(", ")}
                    </p>
                  )}

                  {planToDays(it).map((activities, d) => (
                    <div className="itinerary-day" key={d}>
                      <h3 className="itinerary-day-title">Day {d + 1}</h3>
                      <ul className="itinerary-activities">
                        {activities.map((activity, a) => (
                          <li key={a}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {it.family_friendly && (
                    <p className="itinerary-note">*Family-friendly</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </Container>
        <FollowModal
          show={modalMode !== null}
          onHide={() => setModalMode(null)}
          mode={modalMode ?? "follow"}
          following={profile.following}
          followers={profile.followers}
          currentUser={profile.username}
          onChanged={loadProfile}
        />
        <div className="profile-account">
          <Container>
            <h2 className="profile-account-title">Account</h2>
            <p className="profile-account-warning">
              Deleting your profile removes all your itineraries and cannot be
              undone.
            </p>
            <Button
              className="profile-delete-btn"
              onClick={onDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </Container>
        </div>
      </div>
    </>
  );
}
