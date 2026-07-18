# AI Disclosure

This project used AI assistance through Claude Fable 5.0 for planning, debugging, UI/CSS guidance, deployment troubleshooting, and README documentation support.

## Disclosure Log (Julia)

| Category       | Prompt / Use                                                                                                                                                                                                                                                                                                                                                | Reason for Use                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Profile Page    | "I need to create a modal component using React + Bootstrap to popup and display either: all of the users in the database (to follow), all of the users a user is following (following list) and all of the users following a user (followers list). In these modals, a user will also be able to follow (in to follow modal), unfollow (in following modal) or remove follower (in followers modal). I have created the mongo queries to perform these operations, which I am pasting here: {inserted current queries from ventureDB.js} I am also pasting the routes that will need to be triggered from routes/profile.js: {insert current routes from routes/profile.js} Please create the modal for me using very basic Bootstrap styling and these props:   show, onHide, mode, following, followers, currentUser onChanged. I will wire it into my profile page.                                                                                                                                                                                                                                                                                         | To quickly generate a styled modal component for the profile page.  |
| Deployment    | "Why is my Express + React application deployed on render (as a web service) not finding vite or React?"                                                                                                                                                                                                                                                                    | To debug errors displaying in console but not deployment logs.          |
| Design    | "What is a font close to Georgia that I can import from Google Fonts? I used Georgia in my design mockups and would like to use a similar font in my React web application."                                                                                                                                                                                                                                                                    | To quickly identify a similar font to Georgia.          |

---

## AI Disclosure Log (Carey)

## AI Disclosure Log

This project used AI assistance (Claude, Anthropic) during development. The prompts used and how each output was applied are logged below for transparency.

## AI Disclosure Log

This project used AI assistance (Claude, Anthropic and CoPilot) during development. The prompts used and how each output was applied are logged below for transparency.

| # | Purpose | Prompt | How Output Was Used |
|---|---------|--------|----------------------|
| 1 | Generate mock data | Create mock data set for MongoDB. List 1000 travel itinerary titles with a comma in between, they can be short, create a spreadsheet with 1000 rows/entries, list these under the title, include other columns of theme, caption, country, city, num_days (up to 10), num_people (1-12), fitness_level (choose from the following: Easy, Moderate, Active, Challenging, Strenuous), family_friendly (true or false), plan MongoDB object 1: array 0: activity 1, 1: activity 2, creator (random fake user names), likes (0-75), collaborators (leave blank) | Used as seed/mock data to populate MongoDB for development and testing |
| 2 | Frontend structure guidance | If I want to put multiple cards on the create page, can I nest them inside the form element? | Informed how the create page's form/card layout was structured |
| 3 | Dynamic day cards | I want to use the DayPlan.jsx to create a day card for each day of the trip. It will be part of the form, but the number of days that appear will be determined by the day range entry. | Used to implement dynamic rendering of DayPlan components based on trip length |
| 4 | Form field behavior | How would I change the add the activity button to save the data in the field not submit. | Used to fix button behavior so activities are added without triggering form submission |
| 5 | Element ID naming | What are some ways to label the button id for the save activity button to reflect each day added | Used to generate unique IDs per day for the save-activity buttons |
| 6 | CSS bug fix | Why is the fitness level box going outside of the card. Fitness level is still going out of the card | Used to debug and correct CSS causing the fitness level element to overflow its container |
| 7 | Feed card styling | The feed card header color is showing like a block, and I want it to have the rounded corners in the card, not just blocks | Used to fix border-radius/overflow styling on the feed card header |
| 8 | Icon styling | I added a like icon, the image is gray, how do I use coding to color it | Used to apply CSS/SVG techniques to color the like icon |
| 9 | Feed features | I want to add the following: 1. A toggle button showing the feed of people you follow or all users, 2. A search field for all itineraries | Used to implement the feed toggle and itinerary search functionality |
| 10 | Delete itinerary | I still need a simple delete itinerary. Can we add a button after it is loaded on the create page? I still need a simple delete itinerary. How could I add a button after it is loaded on the create page? | Used to implement a delete button on the create page |
| 11 | Delete via edit menu | How would I add it to the edit drop-down menu | Used to move/integrate delete functionality into the edit dropdown |
| 12 | Edit permissions | I would like to allow users to edit itineraries they own or collaborate with other on, likely loading them in the create page, similar to the way I did for the prompt moderator page | Used to implement edit access for owners/collaborators via the create page |
| 13 | UI consolidation | I want it to be more simple to keep the edit and delete on the create page only, remove the delete and edit buttons from the feed cards and keep it more simple only in that page | Used to simplify the feed UI and centralize edit/delete actions on the create page |
