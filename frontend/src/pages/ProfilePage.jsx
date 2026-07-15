import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import NavigationBar from "../components/NavigationBar.jsx";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        navigate("/");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data);
    };
    loadProfile();
  }, [navigate]);

  if (!profile) {
    return (
      <>
        <NavigationBar />
        <Container>
          <h1>Profile</h1>
          <div>Loading...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <h1>{profile.username}</h1>
        <div>
          {profile.followers.length} followers · {profile.following.length} following
        </div>

        <h2>My Itineraries</h2>
        {profile.itineraries.length === 0 ? (
          <div>No itineraries yet.</div>
        ) : (
          profile.itineraries.map((it) => (
            <div key={it._id}>{it.title}</div>
          ))
        )}
      </Container>
    </>
  );
}