import { useState, useRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link, NavLink, useNavigate } from "react-router";
import "../css/Navbar.css";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef(null);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      navigate("/");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape" && expanded) {
      e.stopPropagation();
      setExpanded(false);
      toggleRef.current?.focus();
    }
  };
  const onSelect = () => setExpanded(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        onSelect={onSelect}
        onKeyDown={onKeyDown}
        className="venture-navbar"
      >
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/" className="venture-brand">
            <img
              src="/compass.png"
              alt="Compass icon for the app logo"
              className="venture-brand-logo"
            />
            <span className="venture-brand-name">Venture</span>
          </Navbar.Brand>

          <Navbar.Toggle ref={toggleRef} aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto venture-nav">
              <Nav.Link
                as={NavLink}
                to="/feed"
                end
                className="venture-nav-link"
              >
                <img
                  src="/home.png"
                  alt="A home icon"
                  className="venture-nav-icon"
                />
                Home
              </Nav.Link>

              <Nav.Link as={NavLink} to="/create" className="venture-nav-link">
                <img
                  src="/pencil.png"
                  alt="A pencil button to indicate create, edit, and delete"
                  className="venture-nav-icon"
                />
                Curate
              </Nav.Link>

              <Nav.Link as={NavLink} to="/profile" className="venture-nav-link">
                <img
                  src="/profile.png"
                  alt="A person icon for user profile"
                  className="venture-nav-icon"
                />
                Profile
              </Nav.Link>

              <Nav.Link as={NavLink} to="/help" className="venture-nav-link">
                <img
                  src="/help.png"
                  alt="An info icon for the help page"
                  className="venture-nav-icon"
                />
                Help
              </Nav.Link>

              <Nav.Link
                as="button"
                type="button"
                onClick={onLogout}
                className="venture-nav-link"
              >
                <img
                  src="/logout.png"
                  alt="Logout icon"
                  className="venture-nav-icon"
                />
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
