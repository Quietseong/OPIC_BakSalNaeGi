import type { Question, QuestionPool, Topic, Roleplay, AdvancedTopic } from "./types";

const q = (id: string, topic: string, type: Question["type"], prompt: string): Question => ({
  id,
  topic,
  type,
  prompt,
});

const intros: Question[] = [
  q("intro-1", "자기소개", "self-introduction", "Let's start the interview now. Tell me a little bit about yourself. Who are you, and what do you usually do these days?"),
  q("intro-2", "자기소개", "self-introduction", "First, I'd like to get to know you. Please introduce yourself and talk about the people and things that are important in your life."),
  q("intro-3", "자기소개", "self-introduction", "Before we begin, tell me about yourself. What is your daily life like, and what do you enjoy doing in your free time?"),
];

const topics: Topic[] = [
  {
    id: "home",
    name: "집",
    descriptions: [
      q("home-d1", "집", "description", "You indicated in the survey that you live in a house or an apartment. Describe your home to me. What does it look like, and how many rooms does it have?"),
      q("home-d2", "집", "description", "Tell me about your favorite room in your home. What is in that room, and why do you like spending time there?"),
    ],
    routines: [
      q("home-r1", "집", "routine", "What do you usually do at home after you finish work or school? Walk me through a typical evening at your place."),
      q("home-r2", "집", "routine", "Tell me about the housework you do at home. Who does which chores, and how often do you clean?"),
    ],
    changes: [
      q("home-c1", "집", "change", "Think about the home you lived in when you were a child. How is it different from the home you live in now? Give me as many details as you can."),
      q("home-c2", "집", "change", "Have you changed anything in your home over the past few years, like furniture or decorations? What did you change, and why?"),
    ],
    experiences: [
      q("home-e1", "집", "past-experience", "Tell me about a time something went wrong at home, like a broken pipe or a power outage. What happened, and how did you deal with it?"),
      q("home-e2", "집", "past-experience", "Describe a memorable day you spent at home with family or friends. What did you do, and why do you still remember it?"),
    ],
  },
  {
    id: "park",
    name: "공원",
    descriptions: [
      q("park-d1", "공원", "description", "You indicated in the survey that you go to parks. Describe a park you like to visit. Where is it, and what does it look like?"),
      q("park-d2", "공원", "description", "Tell me about the people you usually see at the park. What kinds of activities do they do there?"),
    ],
    routines: [
      q("park-r1", "공원", "routine", "What do you usually do when you go to the park? Tell me about a typical visit from beginning to end."),
      q("park-r2", "공원", "routine", "How often do you go to the park, and who do you usually go with? Do you go at a certain time of day?"),
    ],
    changes: [
      q("park-c1", "공원", "change", "How have parks in your area changed over the years? Compare the parks you went to as a child with the parks you visit now."),
      q("park-c2", "공원", "change", "Has the way you spend time at parks changed since you were younger? What did you do there before, and what do you do now?"),
    ],
    experiences: [
      q("park-e1", "공원", "past-experience", "Tell me about a memorable day you had at a park. What happened, and who were you with?"),
      q("park-e2", "공원", "past-experience", "Have you ever had something unexpected happen at a park, like bad weather or meeting someone you knew? Tell me the whole story."),
    ],
  },
  {
    id: "cafe",
    name: "카페",
    descriptions: [
      q("cafe-d1", "카페", "description", "You indicated in the survey that you like going to cafes. Describe your favorite cafe. Where is it, and what is it like inside?"),
      q("cafe-d2", "카페", "description", "Tell me about the cafes in your neighborhood. What kinds of cafes are there, and what makes each one different?"),
    ],
    routines: [
      q("cafe-r1", "카페", "routine", "What do you usually do when you go to a cafe? Tell me what you order and how long you usually stay."),
      q("cafe-r2", "카페", "routine", "When do you usually go to cafes, and who do you go with? Describe a typical cafe visit for you."),
    ],
    changes: [
      q("cafe-c1", "카페", "change", "How have cafes changed over the last several years? Compare cafes in the past with cafes today."),
      q("cafe-c2", "카페", "change", "Have your cafe habits changed over time? What did you drink or do at cafes before, and what do you do now?"),
    ],
    experiences: [
      q("cafe-e1", "카페", "past-experience", "Tell me about a memorable experience you had at a cafe. What happened, and why was it special?"),
      q("cafe-e2", "카페", "past-experience", "Describe a time something went wrong at a cafe, like getting the wrong order or spilling a drink. How did you handle it?"),
    ],
  },
  {
    id: "movies",
    name: "영화",
    descriptions: [
      q("movies-d1", "영화", "description", "You indicated in the survey that you enjoy watching movies. What kinds of movies do you like, and why do you like them?"),
      q("movies-d2", "영화", "description", "Describe the movie theater you usually go to. Where is it, and what is it like?"),
    ],
    routines: [
      q("movies-r1", "영화", "routine", "Tell me what you usually do on a day when you go to see a movie. What do you do before and after the movie?"),
      q("movies-r2", "영화", "routine", "How do you usually choose which movie to watch? Do you read reviews, watch trailers, or ask friends?"),
    ],
    changes: [
      q("movies-c1", "영화", "change", "How has the way people watch movies changed over the years? Compare watching movies in the past with watching them now."),
      q("movies-c2", "영화", "change", "Has your taste in movies changed since you were younger? What did you like before, and what do you like now?"),
    ],
    experiences: [
      q("movies-e1", "영화", "past-experience", "Tell me about a movie that left a strong impression on you. When did you see it, and why do you remember it so well?"),
      q("movies-e2", "영화", "past-experience", "Describe a time something unexpected happened while you were watching a movie at a theater. What happened, and what did you do?"),
    ],
  },
  {
    id: "music",
    name: "음악",
    descriptions: [
      q("music-d1", "음악", "description", "You indicated in the survey that you listen to music. What kind of music do you enjoy, and who are some of your favorite singers or bands?"),
      q("music-d2", "음악", "description", "Describe the devices or apps you use to listen to music. Why do you prefer them?"),
    ],
    routines: [
      q("music-r1", "음악", "routine", "When and where do you usually listen to music? Tell me about your music habits during a normal day."),
      q("music-r2", "음악", "routine", "How do you usually find new songs to listen to? Explain the steps you take."),
    ],
    changes: [
      q("music-c1", "음악", "change", "How has your taste in music changed over time? What did you listen to as a teenager, and what do you listen to now?"),
      q("music-c2", "음악", "change", "How have the ways people listen to music changed in your country? Compare the past and the present with details."),
    ],
    experiences: [
      q("music-e1", "음악", "past-experience", "Tell me about the first time you really fell in love with a song or an artist. How old were you, and what happened?"),
      q("music-e2", "음악", "past-experience", "Describe a special moment in your life when music played an important role. Where were you, and how did you feel?"),
    ],
  },
  {
    id: "concerts",
    name: "공연·콘서트",
    descriptions: [
      q("concerts-d1", "공연·콘서트", "description", "You indicated in the survey that you go to concerts or performances. What kinds of shows do you like to see, and why?"),
      q("concerts-d2", "공연·콘서트", "description", "Describe a concert hall or performance place you have been to. What does it look like, and what is the atmosphere like?"),
    ],
    routines: [
      q("concerts-r1", "공연·콘서트", "routine", "What do you usually do before you go to a concert? Tell me how you get tickets and prepare for the day."),
      q("concerts-r2", "공연·콘서트", "routine", "Who do you usually go to concerts with, and what do you do after the show is over?"),
    ],
    changes: [
      q("concerts-c1", "공연·콘서트", "change", "How have concerts and live shows changed over the years? Compare them in the past with how they are today."),
      q("concerts-c2", "공연·콘서트", "change", "Have the kinds of performances you enjoy changed over time? Tell me what you liked before and what you like now."),
    ],
    experiences: [
      q("concerts-e1", "공연·콘서트", "past-experience", "Tell me about the most memorable concert or show you have ever been to. Who performed, and what made it so special?"),
      q("concerts-e2", "공연·콘서트", "past-experience", "Describe a time something unexpected happened at a concert or performance. What happened, and how did people react?"),
    ],
  },
  {
    id: "beach",
    name: "해변",
    descriptions: [
      q("beach-d1", "해변", "description", "You indicated in the survey that you like going to the beach. Describe a beach you like to visit. Where is it, and what does it look like?"),
      q("beach-d2", "해변", "description", "Tell me about the things people can do at beaches in your country. Which activities are the most popular?"),
    ],
    routines: [
      q("beach-r1", "해변", "routine", "What do you usually do when you go to the beach? Tell me about a typical day there from morning to evening."),
      q("beach-r2", "해변", "routine", "What do you usually pack when you go to the beach? Explain how you get ready for the trip."),
    ],
    changes: [
      q("beach-c1", "해변", "change", "How have beaches in your country changed over the years? Compare what they were like before with what they are like now."),
      q("beach-c2", "해변", "change", "How is the way you spend time at the beach different now compared to when you were a child?"),
    ],
    experiences: [
      q("beach-e1", "해변", "past-experience", "Tell me about a memorable trip to the beach. When was it, who were you with, and what happened?"),
      q("beach-e2", "해변", "past-experience", "Describe a time something unexpected happened at the beach, like sudden rain or losing something. How did you handle it?"),
    ],
  },
  {
    id: "walking",
    name: "걷기·조깅",
    descriptions: [
      q("walking-d1", "걷기·조깅", "description", "You indicated in the survey that you go walking or jogging. Describe the place where you usually walk or jog. What can you see there?"),
      q("walking-d2", "걷기·조깅", "description", "Tell me why you enjoy walking or jogging. How does it help you in your daily life?"),
    ],
    routines: [
      q("walking-r1", "걷기·조깅", "routine", "When do you usually go walking or jogging, and for how long? Walk me through your usual routine."),
      q("walking-r2", "걷기·조깅", "routine", "What do you do before and after you go jogging or walking? Tell me about how you prepare and how you rest."),
    ],
    changes: [
      q("walking-c1", "걷기·조깅", "change", "How did you first start walking or jogging? How has your routine changed since then?"),
      q("walking-c2", "걷기·조깅", "change", "How have walking paths or jogging areas in your city changed over the years? Give me some details."),
    ],
    experiences: [
      q("walking-e1", "걷기·조깅", "past-experience", "Tell me about a memorable walk or jog you had. Where were you, and what made it memorable?"),
      q("walking-e2", "걷기·조깅", "past-experience", "Describe a time you had a problem while walking or jogging, like getting hurt or getting lost. What happened next?"),
    ],
  },
  {
    id: "domestic-travel",
    name: "국내 여행",
    descriptions: [
      q("domestic-travel-d1", "국내 여행", "description", "You indicated in the survey that you travel within your country. Tell me about a place in your country that you like to visit. Why do you like it?"),
      q("domestic-travel-d2", "국내 여행", "description", "Describe some popular travel spots in your country. What can visitors see and do there?"),
    ],
    routines: [
      q("domestic-travel-r1", "국내 여행", "routine", "How do you usually prepare for a trip in your country? Tell me what you do from planning to packing."),
      q("domestic-travel-r2", "국내 여행", "routine", "What do you usually do when you arrive at a new place on a trip? Describe a typical day of traveling for you."),
    ],
    changes: [
      q("domestic-travel-c1", "국내 여행", "change", "How has traveling within your country changed over the years? Compare how people traveled before with how they travel now."),
      q("domestic-travel-c2", "국내 여행", "change", "Think about a place you visited more than once. How was it different the second time? Tell me what changed."),
    ],
    experiences: [
      q("domestic-travel-e1", "국내 여행", "past-experience", "Tell me about the most memorable trip you have taken in your country. Where did you go, and what happened?"),
      q("domestic-travel-e2", "국내 여행", "past-experience", "Describe a time something did not go as planned on a trip in your country. What went wrong, and how did you solve it?"),
    ],
  },
  {
    id: "overseas-travel",
    name: "해외 여행",
    descriptions: [
      q("overseas-travel-d1", "해외 여행", "description", "You indicated in the survey that you travel abroad. Tell me about a country you have visited. What was it like there?"),
      q("overseas-travel-d2", "해외 여행", "description", "Describe a city in another country that you would like to visit again. What makes that city special to you?"),
    ],
    routines: [
      q("overseas-travel-r1", "해외 여행", "routine", "What do you usually do to get ready for a trip abroad? Tell me about the steps you take before you leave."),
      q("overseas-travel-r2", "해외 여행", "routine", "When you travel to another country, what do you usually do during the day? Describe your travel style."),
    ],
    changes: [
      q("overseas-travel-c1", "해외 여행", "change", "How has traveling abroad changed compared to the past? Talk about things like booking, airports, or using phones while traveling."),
      q("overseas-travel-c2", "해외 여행", "change", "How have your travel habits changed since your first trip abroad? What do you do differently now?"),
    ],
    experiences: [
      q("overseas-travel-e1", "해외 여행", "past-experience", "Tell me about your first trip to another country. Where did you go, who did you go with, and how did you feel?"),
      q("overseas-travel-e2", "해외 여행", "past-experience", "Describe a time something unexpected happened while you were traveling abroad, like a delayed flight or a lost bag. What did you do?"),
    ],
  },
  {
    id: "recycling",
    name: "재활용",
    descriptions: [
      q("recycling-d1", "재활용", "description", "I'd like to know about recycling in your country. How do people recycle, and what kinds of things do they separate?"),
      q("recycling-d2", "재활용", "description", "Describe the place where you put out recycling in your home or building. What does it look like, and what are the rules?"),
    ],
    routines: [
      q("recycling-r1", "재활용", "routine", "How do you usually recycle at home? Tell me what you do with plastic, paper, and food waste."),
      q("recycling-r2", "재활용", "routine", "How often do you take out the recycling, and who does it in your home? Walk me through the process."),
    ],
    changes: [
      q("recycling-c1", "재활용", "change", "How has recycling changed in your country over the years? Compare the rules or habits of the past with today."),
      q("recycling-c2", "재활용", "change", "Have your own recycling habits changed over time? What did you do before, and what do you do now?"),
    ],
    experiences: [
      q("recycling-e1", "재활용", "past-experience", "Tell me about a time you had trouble with recycling, like using the wrong bin or missing the pickup day. What happened?"),
      q("recycling-e2", "재활용", "past-experience", "Describe a time when you learned something new about recycling. Who taught you, and how did it change what you do?"),
    ],
  },
  {
    id: "technology",
    name: "기술·인터넷",
    descriptions: [
      q("technology-d1", "기술·인터넷", "description", "Tell me about a piece of technology you use every day. What is it, and how does it help you?"),
      q("technology-d2", "기술·인터넷", "description", "Describe the websites or apps you use most often. What do you use them for?"),
    ],
    routines: [
      q("technology-r1", "기술·인터넷", "routine", "How do you usually use the internet during a normal day? Tell me what you do online from morning to night."),
      q("technology-r2", "기술·인터넷", "routine", "When you need to find information, how do you usually search for it? Explain the steps you take."),
    ],
    changes: [
      q("technology-c1", "기술·인터넷", "change", "How has the internet changed since you first started using it? Compare what it was like then with what it is like now."),
      q("technology-c2", "기술·인터넷", "change", "Think about the phone you used several years ago. How is it different from the phone you use today?"),
    ],
    experiences: [
      q("technology-e1", "기술·인터넷", "past-experience", "Tell me about a time you had a problem with a computer, phone, or internet connection. What happened, and how did you fix it?"),
      q("technology-e2", "기술·인터넷", "past-experience", "Describe a time when technology helped you a lot, like finding your way or getting something done quickly. Tell me the whole story."),
    ],
  },
];

const roleplays: Roleplay[] = [
  {
    id: "rp-hotel",
    name: "호텔 예약",
    ask: q("rp-hotel-ask", "호텔 예약", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to stay at a hotel for a weekend trip. Call the hotel and ask three or four questions about the rooms and prices."),
    solve: q("rp-hotel-solve", "호텔 예약", "roleplay-solve", "I'm sorry, but there is a problem. When you arrive at the hotel, they say your room is not ready and it is smaller than you booked. Explain the problem to the staff and suggest two or three ways to solve it."),
    experience: q("rp-hotel-exp", "호텔 예약", "roleplay-experience", "Have you ever had a problem at a hotel or another place you stayed? Tell me what happened and how it was solved."),
  },
  {
    id: "rp-concert-tickets",
    name: "콘서트 티켓 구매",
    ask: q("rp-concert-tickets-ask", "콘서트 티켓 구매", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to buy tickets for a concert. Call the ticket office and ask three or four questions to get the information you need."),
    solve: q("rp-concert-tickets-solve", "콘서트 티켓 구매", "roleplay-solve", "There is a problem. On the day of the concert, you realize you cannot go because something urgent came up. Call your friend who was going with you, explain the situation, and offer two or three alternatives."),
    experience: q("rp-concert-tickets-exp", "콘서트 티켓 구매", "roleplay-experience", "Have you ever had to cancel or change plans at the last minute? Tell me what happened and how you handled it."),
  },
  {
    id: "rp-car-rental",
    name: "렌터카 대여",
    ask: q("rp-car-rental-ask", "렌터카 대여", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to rent a car for a short trip. Call the rental company and ask three or four questions about the cars they have."),
    solve: q("rp-car-rental-solve", "렌터카 대여", "roleplay-solve", "Unfortunately, there is a problem. While you are driving the rental car, it breaks down on the road. Call the rental company, explain what happened, and suggest two or three solutions."),
    experience: q("rp-car-rental-exp", "렌터카 대여", "roleplay-experience", "Tell me about a time you had trouble while you were driving or using transportation. What happened, and what did you do?"),
  },
  {
    id: "rp-gym",
    name: "헬스장 등록",
    ask: q("rp-gym-ask", "헬스장 등록", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to join a new gym near your home. Visit the front desk and ask three or four questions about the membership."),
    solve: q("rp-gym-solve", "헬스장 등록", "roleplay-solve", "There is a problem. After you pay for a three-month membership, you hurt your leg and cannot exercise for a while. Talk to the gym manager, explain the situation, and offer two or three alternatives."),
    experience: q("rp-gym-exp", "헬스장 등록", "roleplay-experience", "Have you ever signed up for a class or membership and then had to stop or change it? Tell me what happened."),
  },
  {
    id: "rp-phone-repair",
    name: "휴대폰 수리",
    ask: q("rp-phone-repair-ask", "휴대폰 수리", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. Your phone is not working well. Call a repair shop and ask three or four questions about fixing it."),
    solve: q("rp-phone-repair-solve", "휴대폰 수리", "roleplay-solve", "There is a problem. When you go to pick up your phone, the shop tells you it is still not fixed and you need it today. Explain your situation to the staff and suggest two or three solutions."),
    experience: q("rp-phone-repair-exp", "휴대폰 수리", "roleplay-experience", "Tell me about a time something you owned broke and you had to get it repaired. What happened, and how did it turn out?"),
  },
  {
    id: "rp-furniture",
    name: "가구 배송",
    ask: q("rp-furniture-ask", "가구 배송", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to buy a new sofa for your home. Visit a furniture store and ask three or four questions about the sofa and delivery."),
    solve: q("rp-furniture-solve", "가구 배송", "roleplay-solve", "There is a problem. The sofa arrives at your home, but it is damaged and it is the wrong color. Call the store, explain the problem, and offer two or three ways to fix it."),
    experience: q("rp-furniture-exp", "가구 배송", "roleplay-experience", "Have you ever received something you ordered that was damaged or wrong? Tell me what happened and what you did about it."),
  },
  {
    id: "rp-restaurant",
    name: "식당 예약",
    ask: q("rp-restaurant-ask", "식당 예약", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to have a birthday dinner for a friend at a restaurant. Call the restaurant and ask three or four questions to make a reservation."),
    solve: q("rp-restaurant-solve", "식당 예약", "roleplay-solve", "There is a problem. On the day of the dinner, more people want to come than you planned for. Call the restaurant, explain the situation, and suggest two or three alternatives."),
    experience: q("rp-restaurant-exp", "식당 예약", "roleplay-experience", "Tell me about a special meal you planned for someone. What did you prepare, and did everything go as planned?"),
  },
  {
    id: "rp-borrow",
    name: "친구 물건 빌리기",
    ask: q("rp-borrow-ask", "친구 물건 빌리기", "roleplay-ask", "I'd like to give you a situation and ask you to act it out. You want to borrow a camera from your friend for a trip. Call your friend and ask three or four questions about borrowing it."),
    solve: q("rp-borrow-solve", "친구 물건 빌리기", "roleplay-solve", "I'm sorry, but there is a problem. During your trip, you accidentally broke your friend's camera. Call your friend, explain what happened, and offer two or three ways to make it right."),
    experience: q("rp-borrow-exp", "친구 물건 빌리기", "roleplay-experience", "Have you ever lost or broken something that belonged to someone else? Tell me what happened and how you handled it."),
  },
];

const advanced: AdvancedTopic[] = [
  {
    id: "adv-technology",
    name: "기술",
    comparison: q("adv-technology-cmp", "기술", "comparison", "Compare the technology people used ten years ago with the technology they use today. What are the biggest differences, and how have they changed daily life?"),
    issue: q("adv-technology-issue", "기술", "issue", "Many people worry about their personal information being shared online. What concerns do people have about this, and what do you think should be done?"),
  },
  {
    id: "adv-housing",
    name: "주거",
    comparison: q("adv-housing-cmp", "주거", "comparison", "Compare the homes people lived in when you were young with the homes people live in today. How have houses and apartments changed?"),
    issue: q("adv-housing-issue", "주거", "issue", "Housing costs have become a big topic in many places. Why is it hard for young people to find a home, and what do people say about this problem?"),
  },
  {
    id: "adv-health",
    name: "건강",
    comparison: q("adv-health-cmp", "건강", "comparison", "How are people's ideas about health different now compared to the past? Talk about food, exercise, or anything else that has changed."),
    issue: q("adv-health-issue", "건강", "issue", "Some people say stress is one of the biggest health problems today. Why do people feel so much stress, and what can they do about it?"),
  },
  {
    id: "adv-transportation",
    name: "교통",
    comparison: q("adv-transportation-cmp", "교통", "comparison", "Compare public transportation in your city today with what it was like several years ago. What has improved, and what is still the same?"),
    issue: q("adv-transportation-issue", "교통", "issue", "Traffic is a common problem in big cities. What problems does heavy traffic cause, and what solutions do people talk about?"),
  },
  {
    id: "adv-shopping",
    name: "쇼핑",
    comparison: q("adv-shopping-cmp", "쇼핑", "comparison", "Compare shopping in stores with shopping online. What are the good and bad points of each, and which do you prefer?"),
    issue: q("adv-shopping-issue", "쇼핑", "issue", "Online shopping creates a lot of boxes and packaging waste. Why do people worry about this, and what could stores or customers do differently?"),
  },
  {
    id: "adv-environment",
    name: "환경",
    comparison: q("adv-environment-cmp", "환경", "comparison", "How has the weather or environment in your country changed compared to when you were a child? Give me some specific examples."),
    issue: q("adv-environment-issue", "환경", "issue", "Many people talk about air pollution or climate change these days. What is one environmental issue people in your country care about, and why?"),
  },
  {
    id: "adv-work",
    name: "직장",
    comparison: q("adv-work-cmp", "직장", "comparison", "Compare the way people worked in the past with the way they work now. Talk about things like working hours, offices, or working from home."),
    issue: q("adv-work-issue", "직장", "issue", "Some people say it is hard to balance work and personal life. Why is this difficult, and what do people around you do to manage it?"),
  },
  {
    id: "adv-education",
    name: "교육",
    comparison: q("adv-education-cmp", "교육", "comparison", "Compare how students studied when you were in school with how students study today. What tools and methods have changed?"),
    issue: q("adv-education-issue", "교육", "issue", "Many parents spend a lot of money on private classes for their children. Why do people do this, and what are the concerns about it?"),
  },
];

export const QUESTION_POOL: QuestionPool = { version: 1, intros, topics, roleplays, advanced };
