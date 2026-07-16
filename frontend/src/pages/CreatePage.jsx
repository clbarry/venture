/* Resource https://react.dev/reference/react-dom/components/form */
/* Resource, React Bootstrap :https://react-bootstrap.netlify.app/docs/forms/overview */

import Container from "react-bootstrap/Container";

/* Import React components */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/* Import Components and styling*/
import NavigationBar from "../components/NavigationBar.jsx";
import DayPlans from "../components/DayPlans.jsx";
import "../css/CreatePage.css";

export default function CreatePage() {
  const navigate = useNavigate();
  const [dayCount, setDayCount] = useState(1);

  useEffect(() => {
    fetch("/api/auth/user").then((res) => {
      if (!res.ok) navigate("/");
    });
  }, [navigate]);

  const handleDayCountChange = (event) => {
    setDayCount(Number(event.target.value));
  };

  return (
    <>
      {/* Navigation */}
      <NavigationBar />
      {/* create page body */}
      <main className="create-page-body">
        {/* page title */}
        <Container className="create-page-title">
          <h1>Create</h1>
        </Container>

        {/* page description */}
        <header className="create-page-header">
          <h2 className="create-page-headline">
            Create an itinerary & plan your next adventure.
          </h2>
          <p className="create-page-description">
            Sketch a day-by-day plan and share it with your people.
          </p>
        </header>

        {/* form entry - itinerary title */}
        <div className="create-form">
          <form method="post" action="/create">
            {/* form card */}
            <div className="create-form-card">
              {/* form entry - itinerary title */}
              {/* text input */}
              <div className="container form-entry">
                <label htmlFor="itineraryTitle">title</label>
                <input
                  type="text"
                  name="title"
                  id="itineraryTitle"
                  placeholder="A perfect week in..."
                  required
                />
              </div>

              {/* form entry - itinerary theme */}
              {/* text input */}
              <div className="form-entry">
                <label htmlFor="theme">theme</label>
                <input type="text" name="theme" id="theme" required />
              </div>

              {/* form entry - itinerary fitness level */}
              {/* drop down */}
              <div className="form-entry">
                <label htmlFor="fitnessLevel">fitness level</label>
                <select name="fitnessLevel" id="fitnessLevel" required>
                  <option value="">
                    Select fitness level needed for this itinerary
                  </option>
                  <option value="easy">
                    Easy: mostly flat walking, short distances, frequent rest
                    stops.
                  </option>
                  <option value="moderate">
                    Moderate: some hills, longer distances, occasional rest
                    stops.
                  </option>
                  <option value="active">
                    Active: full-day hikes, uneven terrain, moderate elevation
                    gain.{" "}
                  </option>
                  <option value="challenging">
                    Challenging: long, strenuous hikes with steep climbs and
                    rough terrain.
                  </option>
                  <option value="strenuous">
                    Strenuous: multi-day trekking, high altitude, sustained
                    physical exertion.
                  </option>
                </select>
              </div>

              {/* form entry - itinerary country */}
              {/* text area */}
              <div className="form-entry">
                <label htmlFor="country">country</label>
                <textarea name="country" id="country" required></textarea>
              </div>

              {/* form entry - city/region */}
              <div className="form-entry">
                <label htmlFor="cityRegion">city/region</label>
                <textarea name="cityRegion" id="cityRegion" required></textarea>
              </div>

              {/* form entry - itinerary duration */}
              {/* slider */}
              <div className="form-entry">
                <label htmlFor="days">number of days</label>
                <input
                  type="range"
                  name="days"
                  id="days"
                  min="1"
                  max="10"
                  value={dayCount}
                  onChange={handleDayCountChange}
                  required
                />
                <span>
                  {dayCount} day{dayCount === 1 ? "" : "s"}
                </span>
              </div>

              {/* form entry - family friendly */}
              {/* checkbox */}
              <div className="form-entry">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Family Friendly
                </label>
              </div>

              {/* form entry - collaborators */}
              {/* text entry with multiple selection */}
              <div className="form-entry">
                <label htmlFor="collaborators">collaborators</label>
                <input
                  type="text"
                  name="collaborators"
                  id="collaborators"
                  placeholder="@friend1, @friend2, @friend3..."
                />
              </div>
            </div>{" "}
            {/* form create-form-card end */}
            <br />
            <br />
            {Array.from({ length: dayCount }, (_, index) => (
              <DayPlans key={index} dayNumber={index + 1} />
            ))}
            <br />
            <br />
            {/* submit button */}
            <div className="create-form-submit d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="submit"
                id="publishButton"
                className="btn btn-primary"
              >
                Publish
              </button>
            </div>
          </form>{" "}
          {/* form end */}
        </div>
      </main>{" "}
      {/* close create-page-body */}
    </>
  );
}
