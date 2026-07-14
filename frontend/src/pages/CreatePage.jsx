import Container from "react-bootstrap/Container";
import NavigationBar from "../components/NavigationBar.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function CreatePage() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/api/auth/user").then((res) => {
      if (!res.ok) navigate("/login");
    });
  }, [navigate]);
  return (
    <>
      <NavigationBar />
      <Container>
        <h1>Create</h1>
      </Container>
    </>
  );
}
