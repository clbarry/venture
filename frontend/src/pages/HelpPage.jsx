import "../css/HelpPage.css";
import { useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
const FAQ_SECTIONS = [
  {
    section: "General",
    questions: [
      {
        q: "What is Venture?",
        a: "Venture is a travel-based social media application. It lets you view other users' travel itineraries, past or present, to get ideas and recommendations for your own trips, and it lets you build itineraries collaboratively with others for group travel.",
      },
      {
        q: "Who is Venture for?",
        a: "Venture is for travelers who want inspiration from other people's trips, and for groups who want to plan a trip together in one shared place.",
      },
      {
        q: "How do I log in or log out?",
        a: "You can log out using the 'Logout' button in the top right corner of the page, directly right of this page's navigation button.",
      },
    ],
  },
  {
    section: "Profile Page",
    questions: [
      {
        q: "How do I view my followers and who I'm following?",
        a: "Your Profile page shows both your followers and the users you're following. Click on the words 'Followers' or 'Following' to view the list of users.",
      },
      {
        q: "How do I follow or unfollow another user?",
        a: "You can follow other users from your Profile page to keep up with the itineraries they post by clicking on the 'Follow' button containing a magnifying glass icon, on the right of the profile. You can unfollow by clicking the red 'Unfollow' button next to each user's name inside the 'Following' pop-up.",
      },
      {
        q: "How do I view the itineraries I've posted?",
        a: "Your Profile page lists all of the itineraries you've posted.",
      },
      {
        q: "How do I delete my account?",
        a: "You can delete your account from your Profile page by scrolling to the bottom and clicking 'Delete Account'.",
      },
    ],
  },
  {
    section: "Feed Page",
    questions: [
      {
        q: "What can I see on the Feed page?",
        a: "The Feed page shows itineraries posted by other users, so you can browse other travelers' trips for ideas and recommendations.",
      },
      {
        q: "How do I like an itinerary?",
        a: "Like an itinerary on your feed by clicking the thumbs up button. On success, it will indicate that you've liked the post and will add it to your list of Liked Itineraries.",
      },
      {
        q: "What happens when I like an itinerary?",
        a: "Liking an itinerary saves it in 'Liked Itineraries', so you can find it again later.",
      },
      {
        q: "How do I search or filter itineraries on the Feed?",
        a: "The Feed page has search and filter tools you can use to narrow down the itineraries shown. The search bar allows you to search for terms within itineraries posted. The 'Days' dropdown allows you to filter itineraries by number of days.",
      },
    ],
  },
  {
    section: "Curate Page",
    questions: [
      {
        q: "How do I create a new itinerary?",
        a: "You can create a new itinerary from the Curate page. The form will automatically be set to create a new itinerary. Give it a title and specify the number of days, and include all other required fields indicated by the '*'. Once you click 'Publish', your itinerary will be posted and you will be redirected to your profile.",
      },
      {
        q: "How do I edit an existing itinerary?",
        a: "The Curate page lets you edit itineraries you've created, as well as itineraries you're collaborating on with others, by switching the dropdown to one of you existing itineraries.",
      },
      {
        q: "How do I delete an itinerary?",
        a: "You can delete an itinerary from the Curate page using the button at the bottom.",
      },
      {
        q: "How do I collaborate on an itinerary with other users?",
        a: "The Curate page supports building itineraries together, so you and others can collaboratively plan a group trip in one shared itinerary. Type in the desired username in the 'Collaborators' bar and select the account to add it to the list of allowed collaborators.",
      },
    ],
  },
];

export default function HelpPage() {
  // Tracks which FAQ item is currently expanded, using a "section-index"
  // key so items in different sections don't collide.
  const [openKey, setOpenKey] = useState(null);

  const toggleItem = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <NavigationBar />
      <div className="help-page">
        <h1 className="help-page-title">Help &amp; FAQ</h1>
        <p className="help-page-subtitle">
          Welcome to the Venture Help page. Here you can get more info on how to
          use the app, and an FAQ.
        </p>

        {/* Overview */}
        <section className="help-section">
          <h2 className="help-section-title">Overview</h2>
          <div className="help-card">
            <p className="help-card-text">
              Venture is a travel-based social media application. It's built
              around three main pages: your Profile, the Feed, and Curate.
            </p>
            <p className="help-card-text">
              Your Profile page is where you manage your presence on Venture:
              view your followers and who you're following, follow other people,
              see the itineraries you've posted, and delete your account.
            </p>
            <p className="help-card-text">
              The Feed page is where you browse itineraries posted by other
              users to get travel ideas and recommendations. You can like an
              itinerary to save it, and use search and filter tools to find
              itineraries that match what you're looking for.
            </p>
            <p className="help-card-text">
              The Curate page is where you build your own trips: create, edit,
              or delete itineraries you own, or collaborate with others on
              itineraries you're building together for a group trip.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="help-section">
          <h2 className="help-section-title">Frequently Asked Questions</h2>

          {FAQ_SECTIONS.map((group, sectionIndex) => (
            <div className="help-faq-group" key={group.section}>
              <h3 className="help-faq-group-title">{group.section}</h3>

              <div className="help-faq-list">
                {group.questions.map((item, itemIndex) => {
                  const key = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openKey === key;

                  return (
                    <div className="help-faq-item" key={key}>
                      <button
                        type="button"
                        className="help-faq-question"
                        aria-expanded={isOpen}
                        onClick={() => toggleItem(key)}
                      >
                        <span>{item.q}</span>
                        <span className="help-faq-icon">
                          {isOpen ? "-" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="help-faq-answer">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Contact / Support */}
        <section className="help-section">
          <h2 className="help-section-title">Still need help?</h2>
          <div className="help-card">
            <p className="help-card-text"></p>
            <div className="help-contact-row">
              <span className="help-contact-label">Email support:</span>
              <a
                className="help-contact-link"
                href="mailto:weppler.j@northeastern.edu"
              >
                weppler.j@northeastern.edu
              </a>
            </div>
            <div className="help-contact-row">
              <span className="help-contact-label">GitHub repository:</span>
              <a
                className="help-contact-link"
                href="https://github.com/clbarry/venture/tree/p4_venture"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/clbarry/venture
              </a>
            </div>
          </div>
        </section>

        <p className="help-disclaimer">
          This page was generated using Claude Sonnet 5. For more information on
          how AI was used, please see our{" "}
          <a
            className="help-disclaimer-link"
            href="https://github.com/clbarry/venture/blob/p4_venture/AI_Disclosure_p4.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI Disclosure
          </a>
          .
        </p>
      </div>
    </>
  );
}
