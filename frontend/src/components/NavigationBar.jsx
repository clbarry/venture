import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link, NavLink } from "react-router";
import "../css/Navbar.css";

export default function NavigationBar() {
  return (
    <Navbar expand="lg" className="venture-navbar">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="venture-brand">
          <img src="/compass.png" alt="" className="venture-brand-logo" />
          <span className="venture-brand-name">Venture</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto venture-nav">
            <Nav.Link as={NavLink} to="/" end className="venture-nav-link">
              <img src="/home.png" alt="A home icon" className="venture-nav-icon"/>
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/create" className="venture-nav-link">
              <img src="/create.png" alt="A plus button to indicate create" className="venture-nav-icon"/>
              Create
            </Nav.Link>

            <Nav.Link as={NavLink} to="/profile" className="venture-nav-link">
              <img src="/profile.png" alt="A person icon for user profile" className="venture-nav-icon"/>
              Profile
            </Nav.Link>

            <Nav.Link as={NavLink} to="/login" className="venture-nav-link">
              <img src="/logout.png" alt="" className="venture-nav-icon"/>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}