import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/FollowModal.css";

export default function FollowModal({
  show,
  onHide,
  mode,
  following,
  followers,
  currentUser,
  onChanged,
}) {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null); // username currently being (un)followed

  useEffect(() => {
    if (!show || mode !== "follow") return;
    fetch("/api/profile/users")
      .then((res) => (res.ok ? res.json() : []))
      .then(setAllUsers)
      .catch(() => setAllUsers([]));
  }, [show, mode]);

  const source =
    mode === "follow"
      ? allUsers.filter((u) => u !== currentUser)
      : mode === "following"
        ? following
        : followers;

  const visible = source.filter((u) =>
    u.toLowerCase().includes(search.toLowerCase()),
  );

  const act = async (username) => {
    setBusy(username);
    const url =
      mode === "follow"
        ? "/api/profile/follow"
        : mode === "following"
          ? "/api/profile/unfollow"
          : "/api/profile/remove-follower";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (res.ok) onChanged(); 
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      className="follow-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "follow"
            ? "Find accounts"
            : mode === "following"
              ? "Following"
              : "Followers"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        {visible.length === 0 ? (
          <div className="follow-empty">
            {mode === "follow"
              ? "No accounts found."
              : mode === "following"
                ? "Not following anyone yet."
                : "No followers yet."}
          </div>
        ) : (
          <ListGroup variant="flush">
            {visible.map((username) => {
              const alreadyFollowing = following.includes(username);
              return (
                <ListGroup.Item key={username} className="follow-row">
                  <span>@{username}</span>
                  {mode === "follow" ? (
                    <Button
                      size="sm"
                      disabled={alreadyFollowing || busy === username}
                      onClick={() => act(username)}
                    >
                      {alreadyFollowing ? "Following" : "Follow"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={busy === username}
                      onClick={() => act(username)}
                    >
                      {mode === "following" ? "Unfollow" : "Remove"}
                    </Button>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}

FollowModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["follow", "following", "followers"]).isRequired,
  followers: PropTypes.arrayOf(PropTypes.string).isRequired,
  following: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUser: PropTypes.string.isRequired,
  onChanged: PropTypes.func.isRequired,
};
