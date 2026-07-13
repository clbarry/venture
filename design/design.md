# Venture Design Plan # 

# Description
Venture is a full-stack application that leverages a social network approach to travel planning. Venture allows users to create, share, build, and rate travel itineraries, independently or in groups.Collections:Two MongoDB collections will be used: Itineraries and User Profiles.

---

# Database Collections

## Collection #1: Itineraries (itineraries)
_id
Travel Caption
Travel Theme Category
Country
Region
City or Town
Number of Days (max 10 days)
Number of people
Fitness Level
Family Friendly Rating
List of Attractions/Activities by Day
Creator Name
Likes or Dislikes
Tips
Usernames of collaborators (optional)

## Collection #2: User Profiles (user_profiles)
_id
Username
Password
Email
Followers
Following
Created itineraries (list of IDs corresponding to collection 1)

---

## CRUD Operations:

### Collection 1: Itineraries
Create – Create an itinerary.
Read – View the itineraries in the feed.
Update - Edit existing itineraries (can be a user's own or ones a user is invited to). Update the like count on an itinerary by liking it.
Delete - Delete a user’s own itineraries.

### Collection 2: User profiles
Create – Create a new user profile and login information.
Read – See a user’s followers/following lists on their profile.
Update – Following/unfollowing someone will modify a user’s following list.
Delete – Users can delete their profile.

---

## Pages:
Page #1: Welcome/home page with login.
Page #2: Feed page: Default to show all posts from friends/followers, with a search bar and filter bar to query through all itineraries (not just from friends).
Page #3: Profile page: Tab to display all created itineraries. Will also show followers/following. Users can follow or unfollow someone from the user’s profile page. They can also delete their account.
Page #4: Create page for itineraries.

---

## User Personas:
Parent: A parent planning a trip with their family will want to verify if the itineraries they are viewing are family-friendly. They also might want to create an itinerary from scratch and allow each of their kids to add an activity that they like to the trip itinerary.
Solo Traveler: An amateur solo traveler might be looking for ideas on popular travel destinations and what to do there so that they don’t get overwhelmed planning it entirely themselves. They also might want to take inspiration from their friends’ trips or follow other solo travelers to get advice.
Travel Influencer: A travel influencer will want to have a platform to share the details of past trips to their fans and followers in an organized way so that others may replicate their trips.


## User Stories:
As a busy parent, I want to find other travel itineraries to help me plan a family trip, since researching various travel sites and attractions can be time-consuming.
As a parent, I want to create and edit a collaborative itinerary for my family so that my children can each add what activities they want to do to the same list; that way, there is no arguing.
As a parent, I want to see other family-friendly itineraries that people have posted by filtering out non-family-friendly itineraries in my feed.
As an aspiring solo traveler, I want to follow travel influencers and other solo travelers to see what trips they recommend and get inspiration from my feed.
As a solo traveler, I want to like itineraries that I come across that seem exciting. I also want to view itineraries with high like counts to see popular trip ideas.
As a travel influencer, I want to create an account on a platform that allows me to expand my following base and share trips I’ve done in the past.
As a travel influencer, I want to see who follows me to understand my audience.
As a travel influencer, I want to delete itineraries I’ve created that people did not like.


## Technology stack:
Bootstrap
HTML + CSS
React
Passport (Auth)
Node + Express
MongoDB

## Work division:
@Carey Barry – Itineraries collection CRUD. Feed page and create itinerary page.

@Julia Weppler – User profiles collection CRUD. Welcome/home page user login and Profile page.

Both – @Julia Weppler & @Carey Barry will develop the wireframes and style for the application together. They will also decide on the schema of the collections and create mock data in Mockeroo together. Implements authentication using Passport.