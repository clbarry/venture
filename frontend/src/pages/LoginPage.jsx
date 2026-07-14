import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavigationBar from "../components/NavigationBar.jsx";

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
    const body = isLogin ? { username, password } : { username, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      navigate("/");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Something went wrong");
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          {mode === "register" && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit">
            {mode === "login" ? "Login" : "Register"}
          </Button>
          {error && <div>{error}</div>}
        </Form>

        <Button variant="link" onClick={toggleMode}>
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </Container>
    </>
  );
}