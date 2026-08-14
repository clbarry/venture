import { useState } from "react";
import PropTypes from "prop-types";
import "../css/DayPlans.css";

export default function DayPlans({
  dayNumber,
  activities = [],
  onActivitiesChange,
}) {
  const [activityInput, setActivityInput] = useState("");

  const handleAddActivity = () => {
    const trimmedValue = activityInput.trim();
    if (!trimmedValue) {
      return;
    }

    onActivitiesChange?.([...activities, trimmedValue]);
    setActivityInput("");
  };

  const handleRemoveActivity = (indexToRemove) => {
    onActivitiesChange?.(
      activities.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleMoveActivity = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activities.length) {
      return;
    }

    const reorderedActivities = [...activities];
    [reorderedActivities[index], reorderedActivities[targetIndex]] = [
      reorderedActivities[targetIndex],
      reorderedActivities[index],
    ];

    onActivitiesChange?.(reorderedActivities);
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
          <label htmlFor={`day-${dayNumber}-activity-input`}>
            day activities - enter each activity below and press "Add Activity"
            or enter to add it to the list
          </label>
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
                <li key={`${activity}-${index}`}>
                  <span>{activity}</span>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleMoveActivity(index, "up")}
                      disabled={index === 0}
                    >
                      ↑ Up
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleMoveActivity(index, "down")}
                      disabled={index === activities.length - 1}
                    >
                      ↓ Down
                    </button>
                    <button
                      type="button"
                      className="btn btn-link btn-sm"
                      onClick={() => handleRemoveActivity(index)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

DayPlans.propTypes = {
  dayNumber: PropTypes.number.isRequired,
  activities: PropTypes.arrayOf(PropTypes.string),
  onActivitiesChange: PropTypes.func,
};
