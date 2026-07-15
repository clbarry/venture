import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/LoginPage.css";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // to track login or register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isLogin = mode === "login";
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { username, password }
      : { username, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      navigate("/feed");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Something went wrong");
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  const isLogin = mode === "login";

  return (
    <Container fluid className="login-page g-0">
      <Row className="g-0 min-vh-100">
        <Col lg={6} className="login-hero d-flex flex-column">
          <div className="login-brand d-flex align-items-center">
            <img src="/compass.png" alt="" className="login-logo" />
            <span className="login-brand-name">Venture</span>
          </div>

          <div className="login-hero-body">
            <h1 className="login-headline">
              Plan trips together. Get inspired by travelers you love.
            </h1>

            <p className="login-subhead">
              Build day-by-day itineraries, share them like posts, and remix
              ideas from friends, families, and celebrities around the world.
            </p>

            <div className="login-pills">
              <span className="login-pill">Daily Itineraries</span>
              <span className="login-pill">Collaborate with friends</span>
              <span className="login-pill">Discover new places</span>
            </div>

            <p className="login-tagline">
              Made for the solo trips, family vacations, camping expeditions,
              and everything in between.
            </p>
          </div>
        </Col>

        <Col
          lg={6}
          className="login-form-panel d-flex align-items-center justify-content-center"
        >
          <div className="login-form-wrap">
            <h2 className="login-welcome">
              {isLogin ? "Welcome" : "Join Venture"}
            </h2>
            <p className="login-welcome-sub">
              {isLogin
                ? "Sign in to see your feed and keep planning"
                : "Create an account to start planning"}
            </p>

            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="login-username">
                <Form.Label className="visually-hidden">Username</Form.Label>
                <Form.Control
                  className="login-input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              {mode === "register" && (
                <Form.Group className="mb-3" controlId="login-email">
                  <Form.Label className="visually-hidden">Email</Form.Label>
                  <Form.Control
                    className="login-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="login-password">
                <Form.Label className="visually-hidden">Password</Form.Label>
                <Form.Control
                  className="login-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" className="login-submit w-100">
                {isLogin ? "Sign in" : "Sign up"}
              </Button>

              {error && <div className="login-error">{error}</div>}
            </Form>

            <p className="login-toggle-row">
              {isLogin ? "New to Venture?" : "Already have an account?"}{" "}
              <Button
                variant="link"
                className="login-toggle"
                onClick={toggleMode}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
