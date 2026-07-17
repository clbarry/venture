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
  const initialEditId = new URLSearchParams(window.location.search).get("edit") || "";
  const [editableItineraries, setEditableItineraries] = useState([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState("");
  const [dayCount, setDayCount] = useState(1);
  const [dayActivities, setDayActivities] = useState([[]]);
  const [formValues, setFormValues] = useState({
    title: "",
    theme: "",
    fitnessLevel: "",
    country: "",
    cityRegion: "",
    familyFriendly: false,
    collaborators: "",
    caption: "",
  });
  const [publishStatus, setPublishStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/auth/user");
        if (!authRes.ok) {
          navigate("/");
          return;
        }

        const editableRes = await fetch("/create/editable", {
          headers: { Accept: "application/json" },
        });
        if (editableRes.ok) {
          const data = await editableRes.json();
          setEditableItineraries(data.itineraries ?? []);
          if (initialEditId) {
            setSelectedItineraryId(initialEditId);
          }
        }
      } catch {
        setPublishStatus({
          type: "error",
          message: "Could not load editable itineraries.",
        });
      }
    };

    init();
  }, [navigate, initialEditId]);

  const handleDayCountChange = (event) => {
    const nextCount = Number(event.target.value);
    setDayCount(nextCount);
    setDayActivities((prev) => {
      const next = Array.from({ length: nextCount }, (_, index) => prev[index] ?? []);
      return next;
    });
  };

  const handleFormValueChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayActivitiesChange = (dayIndex, nextActivities) => {
    setDayActivities((prev) => prev.map((day, index) => (index === dayIndex ? nextActivities : day)));
  };

  const resetCreateForm = () => {
    setSelectedItineraryId("");
    window.history.replaceState({}, "", "/create");
    setFormValues({
      title: "",
      theme: "",
      fitnessLevel: "",
      country: "",
      cityRegion: "",
      familyFriendly: false,
      collaborators: "",
      caption: "",
    });
    setDayCount(1);
    setDayActivities([[]]);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this itinerary? This cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setPublishStatus({ type: "", message: "" });

    try {
      const res = await fetch(`/api/profile/itineraries/${selectedItineraryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setPublishStatus({
          type: "error",
          message: "Failed to delete itinerary. Please try again.",
        });
        return;
      }

      setPublishStatus({
        type: "success",
        message: "Itinerary deleted successfully.",
      });

      resetCreateForm();

      const editableRes = await fetch("/create/editable", {
        headers: { Accept: "application/json" },
      });
      if (editableRes.ok) {
        const data = await editableRes.json();
        setEditableItineraries(data.itineraries ?? []);
      }
    } catch {
      setPublishStatus({
        type: "error",
        message: "Failed to delete itinerary. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const loadItineraryForEdit = async (itineraryId) => {
    setIsLoadingEdit(true);
    try {
      const res = await fetch(`/create/${itineraryId}`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        setPublishStatus({
          type: "error",
          message: "Could not load itinerary for editing.",
        });
        return;
      }

      const data = await res.json();
      const itinerary = data.itinerary;

      const count = Number(itinerary.day_count) || 1;
      const plan = itinerary.plan && typeof itinerary.plan === "object" ? itinerary.plan : {};
      const loadedDays = Array.from({ length: count }, (_, index) => {
        const values = plan[`day_${index + 1}`];
        return Array.isArray(values) ? values : [];
      });

      setFormValues({
        title: itinerary.title || "",
        theme: itinerary.theme || "",
        fitnessLevel: itinerary.fitness_level || "",
        country: itinerary.country || "",
        cityRegion: itinerary.city || itinerary.cityRegion || "",
        familyFriendly: Boolean(itinerary.family_friendly),
        collaborators: Array.isArray(itinerary.collaborators)
          ? itinerary.collaborators.map((name) => `@${name}`).join(", ")
          : "",
        caption: itinerary.caption || "",
      });
      setDayCount(count);
      setDayActivities(loadedDays);
      window.history.replaceState({}, "", `/create?edit=${encodeURIComponent(itineraryId)}`);
    } catch {
      setPublishStatus({
        type: "error",
        message: "Could not load itinerary for editing.",
      });
    } finally {
      setIsLoadingEdit(false);
    }
  };

  useEffect(() => {
    if (!selectedItineraryId) return;
    loadItineraryForEdit(selectedItineraryId);
  }, [selectedItineraryId]);

  const handleEditableSelectChange = async (event) => {
    const itineraryId = event.target.value;
    setSelectedItineraryId(itineraryId);
    setPublishStatus({ type: "", message: "" });

    if (!itineraryId) {
      resetCreateForm();
      return;
    }

    loadItineraryForEdit(itineraryId);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    const bodyParams = new URLSearchParams();
    bodyParams.set("title", formValues.title);
    bodyParams.set("theme", formValues.theme);
    bodyParams.set("fitnessLevel", formValues.fitnessLevel);
    bodyParams.set("country", formValues.country);
    bodyParams.set("cityRegion", formValues.cityRegion);
    bodyParams.set("dayCount", String(dayCount));
    if (formValues.familyFriendly) {
      bodyParams.set("familyFriendly", "yes");
    }
    bodyParams.set("collaborators", formValues.collaborators);
    bodyParams.set("caption", formValues.caption);

    dayActivities.forEach((activities, dayIndex) => {
      activities.forEach((activity) => {
        bodyParams.append(`days[${dayIndex}][activities][]`, activity);
      });
    });

    setIsSubmitting(true);
    setPublishStatus({ type: "", message: "" });

    try {
      const isEditMode = Boolean(selectedItineraryId);
      const res = await fetch(isEditMode ? `/create/${selectedItineraryId}` : "/create", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body: bodyParams.toString(),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setPublishStatus({
          type: "error",
          message: data.error || "Could not save itinerary. Please try again.",
        });
        return;
      }

      setPublishStatus({
        type: "success",
        message: selectedItineraryId
          ? "Itinerary updated successfully."
          : "Itinerary saved successfully.",
      });
      if (!selectedItineraryId) {
        resetCreateForm();
      }

      const editableRes = await fetch("/create/editable", {
        headers: { Accept: "application/json" },
      });
      if (editableRes.ok) {
        const data = await editableRes.json();
        setEditableItineraries(data.itineraries ?? []);
      }
    } catch {
      setPublishStatus({
        type: "error",
        message: "Could not save itinerary. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <NavigationBar />
      {/* create page body */}
      <main className="create-page-body">
        {/* page title */}
        <Container>
          <h1 className="create-page-title">Create & Edit Itineraries</h1>

          {/* page description */}
          <header className="create-page-header">
            <h2 className="create-page-headline">
              Create or edit an itinerary & plan your next adventure.
            </h2>
            <p className="create-page-description">
              Sketch a day-by-day plan and share it with your people.
            </p>
          </header>

          {/* form entry - itinerary title */}
          <div className="create-form">
            <form method="post" action="/create" onSubmit={handleCreateSubmit}>
              <div className="create-form-card row g-3 create-edit-card">
                <div className="form-entry col-12">
                  <label htmlFor="editableItinerary">Create a new itinerary or edit an existing itinerary</label>
                  <select
                    id="editableItinerary"
                    className="form-select"
                    value={selectedItineraryId}
                    onChange={handleEditableSelectChange}
                    disabled={isLoadingEdit || isSubmitting}
                  >
                    <option value="">Create new itinerary</option>
                    {editableItineraries.map((itinerary) => (
                      <option key={itinerary._id} value={itinerary._id}>
                        {(itinerary.title || itinerary.caption || "Untitled itinerary") +
                          ` (${itinerary.creator})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <br />

              {/* form card */}
              <div className="create-form-card row g-3">
                {/* form entry - itinerary title */}
                {/* text input */}
                <div className=" form-entry col-12">
                  <label htmlFor="itineraryTitle">title</label>
                  <input
                    type="text"
                    name="title"
                    id="itineraryTitle"
                    placeholder="A perfect week in..."
                    value={formValues.title}
                    onChange={handleFormValueChange}
                    required
                  />
                </div>

                {/* form entry - itinerary theme */}
                {/* text input */}
                <div className="form-entry col-md-6">
                  <label htmlFor="theme">theme</label>
                  <input
                    type="text"
                    name="theme"
                    id="theme"
                    value={formValues.theme}
                    onChange={handleFormValueChange}
                    required
                  />
                </div>

                {/* form entry - itinerary fitness level */}
                {/* drop down */}
                <div className="form-entry col-md-6">
                  <label htmlFor="fitnessLevel">fitness level</label>
                  <select
                    name="fitnessLevel"
                    id="fitnessLevel"
                    className="form-select"
                    value={formValues.fitnessLevel}
                    onChange={handleFormValueChange}
                    required
                  >
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
                <div className="form-entry col-md-6">
                  <label htmlFor="country">country</label>
                  <textarea
                    name="country"
                    id="country"
                    value={formValues.country}
                    onChange={handleFormValueChange}
                    required
                  ></textarea>
                </div>

                {/* form entry - city/region */}
                <div className="form-entry col-md-6">
                  <label htmlFor="cityRegion">city/region</label>
                  <textarea
                    name="cityRegion"
                    id="cityRegion"
                    value={formValues.cityRegion}
                    onChange={handleFormValueChange}
                    required
                  ></textarea>
                </div>

                {/* form entry - itinerary duration */}
                {/* slider */}
                <div className="form-entry col-md-6">
                  <label htmlFor="days">number of days</label>
                  <input
                    type="range"
                    name="dayCount"
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
                <div className="form-entry d-flex align-items-center gap-2 col-md-6">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="familyFriendly"
                    checked={formValues.familyFriendly}
                    onChange={handleFormValueChange}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Family Friendly
                  </label>
                </div>

                {/* form entry - collaborators */}
                {/* text entry with multiple selection */}
                <div className="form-entry col-12">
                  <label htmlFor="collaborators">collaborators</label>
                  <input
                    type="text"
                    name="collaborators"
                    id="collaborators"
                    placeholder="@friend1, @friend2, @friend3..."
                    value={formValues.collaborators}
                    onChange={handleFormValueChange}
                  />
                </div>

                {/* form entry - caption */}
                {/* text entry */}
                <div className="form-entry col-12">
                  <label htmlFor="caption">caption</label>
                  <input
                    type="text"
                    name="caption"
                    id="caption"
                    placeholder="Create a short caption for your itinerary"
                    value={formValues.caption}
                    onChange={handleFormValueChange}
                  />
                </div>
              </div>{" "}
              {/* form create-form-card end */}
              <br />
              <br />
              {Array.from({ length: dayCount }, (_, index) => (
                <DayPlans
                  key={`${selectedItineraryId || "new"}-${index}`}
                  dayNumber={index + 1}
                  activities={dayActivities[index] ?? []}
                  onActivitiesChange={(next) => handleDayActivitiesChange(index, next)}
                />
              ))}
              {/* submit button */}
              <div className="create-form-submit d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="submit"
                  id="publishButton"
                  className="btn btn-primary"
                  disabled={isSubmitting || isLoadingEdit || isDeleting}
                >
                  {isSubmitting
                    ? selectedItineraryId
                      ? "Saving..."
                      : "Publishing..."
                    : selectedItineraryId
                      ? "Save Changes"
                      : "Publish"}
                </button>

                {selectedItineraryId && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={isSubmitting || isLoadingEdit || isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Itinerary"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetCreateForm}
                      disabled={isSubmitting || isLoadingEdit || isDeleting}
                    >
                      Stop Editing
                    </button>
                  </>
                )}
              </div>

              {publishStatus.message && (
                <p
                  className={`create-publish-status ${publishStatus.type === "error" ? "create-publish-status-error" : "create-publish-status-success"}`}
                  role="status"
                  aria-live="polite"
                >
                  {publishStatus.message}
                </p>
              )}
            </form>{" "}
            {/* form end */}
          </div>
        </Container>
      </main>{" "}
      {/* close create-page-body */}
    </>
  );
}
