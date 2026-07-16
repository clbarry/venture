import { useState } from "react";
import "../css/DayPlans.css";

export default function DayPlans({ dayNumber }) {
  const [activityInput, setActivityInput] = useState("");
  const [activities, setActivities] = useState([]);

  const handleAddActivity = () => {
    const trimmedValue = activityInput.trim();
    if (!trimmedValue) {
      return;
    }

    setActivities((prev) => [...prev, trimmedValue]);
    setActivityInput("");
  };

  const handleActivityKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddActivity();
    }
  };

  return (
    <div className="card day-plans-card mb-3">
      <div className="card-body">
      <h3 className="day-plans-card-title">Day {dayNumber}</h3>

      <div className="form-entry">
        <label htmlFor={`day-${dayNumber}-activity-input`}>day activities</label>
        <input
          type="text"
          id={`day-${dayNumber}-activity-input`}
          placeholder="Arrive in the morning, beach afternoon, dinner in the city, ..."
          value={activityInput}
          onChange={(event) => setActivityInput(event.target.value)}
          onKeyDown={handleActivityKeyDown}
        />
        <div className="d-grid gap-2 d-md-flex">
          <button
            type="button"
            id={`add-activity-btn-day-${dayNumber}`}
            className="btn btn-primary btn-sm me-md-2 activity-add-btn"
            onClick={handleAddActivity}
          >
            Add Activity
          </button>
        </div>

        {activities.map((activity, index) => (
          <input
            key={`${dayNumber}-${index}`}
            type="hidden"
            name={`days[${dayNumber - 1}][activities][]`}
            value={activity}
          />
        ))}

        {activities.length > 0 && (
          <ul>
            {activities.map((activity, index) => (
              <li key={`${activity}-${index}`}>{activity}</li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
}
