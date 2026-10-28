/**
 * Static categories, mood metadata, languages and curated explore items
 */

export const ALL_MOODS = [
  { id: "Flow", label: "Flow", image: "/images/Flow.jpeg" },
  { id: "Chill", label: "Chill", image: "/images/Chill.jpeg" },
  { id: "Party", label: "Party", image: "/images/Party.jpeg" },
  { id: "Romantic", label: "Romantic", image: "/images/Romantic.jpeg" },
  { id: "Focus", label: "Focus", image: "/images/Focus.jpeg" },
  { id: "Warm", label: "Warm", image: "/images/Warm.jpeg" },
  { id: "Sad", label: "Sad", image: "/images/Sad.jpeg" },
  { id: "Dance", label: "Dance", image: "/images/Dance.jpeg" },
  { id: "Motivational", label: "Motivational", image: "/images/Motivational.jpeg" },
  { id: "Night drive", label: "Night Drive", image: "/images/Night drive.jpeg" },
  { id: "Feel good", label: "Feel Good", image: "/images/Feel good.jpeg" },
  { id: "Energetic", label: "Energetic", image: "/images/Energetic.jpeg" },
  { id: "Soft", label: "Soft", image: "/images/Soft.jpeg" },
];

export const ALL_LANGUAGES = [
  "All",
  "English",
  "Hindi",
  "Punjabi",
  "Spanish",
  "Telugu",
  "Tamil",
  "Korean",
  "French",
  "Arabic",
  "Instrumental",
];

export const EXPLORE_DATA = {
  latestSongs: [
    { id: "l1", title: "Noor", singers: ["Arijit Singh", "Shreya Ghoshal"], duration: "4:12", thumbnail: "https://picsum.photos/seed/noor/300/300", mood: ["Romantic"], language: "Hindi" },
    { id: "l2", title: "Raataan Lambiyan", singers: ["Jubin Nautiyal", "Asees Kaur"], duration: "3:50", thumbnail: "https://picsum.photos/seed/raat/300/300", mood: ["Romantic"], language: "Hindi" },
    { id: "l3", title: "Kesariya", singers: ["Arijit Singh"], duration: "4:28", thumbnail: "https://picsum.photos/seed/kesariya/300/300", mood: ["Romantic"], language: "Hindi" },
    { id: "l4", title: "Pehle Pyaar Ka", singers: ["Darshan Raval"], duration: "3:40", thumbnail: "https://picsum.photos/seed/pehla/300/300", mood: ["Chill"], language: "Hindi" },
    { id: "l5", title: "Apna Bana Le", singers: ["Arijit Singh"], duration: "4:21", thumbnail: "https://picsum.photos/seed/apna/300/300", mood: ["Warm"], language: "Hindi" },
    { id: "l6", title: "Tere Vaaste", singers: ["Varun Jain", "Shreya Ghoshal"], duration: "3:09", thumbnail: "https://picsum.photos/seed/terevaaste/300/300", mood: ["Dance"], language: "Hindi" },
  ],
  trendingSongs: [
    { id: "t1", title: "Oo Antava", singers: ["Indravathi Chauhan"], duration: "3:44", thumbnail: "https://picsum.photos/seed/ooantava/300/300", mood: ["Party"], language: "Telugu" },
    { id: "t2", title: "Srivalli", singers: ["Sid Sriram"], duration: "3:41", thumbnail: "https://picsum.photos/seed/srivalli/300/300", mood: ["Romantic"], language: "Telugu" },
    { id: "t3", title: "Naatu Naatu", singers: ["Rahul Sipligunj", "Kaala Bhairava"], duration: "3:35", thumbnail: "https://picsum.photos/seed/naatu/300/300", mood: ["Dance"], language: "Telugu" },
    { id: "t4", title: "Jhoome Jo Pathaan", singers: ["Arijit Singh", "Sukriti Kakar"], duration: "3:28", thumbnail: "https://picsum.photos/seed/pathaan/300/300", mood: ["Dance"], language: "Hindi" },
    { id: "t5", title: "Besharam Rang", singers: ["Shilpa Rao", "Caralisa Monteiro"], duration: "4:18", thumbnail: "https://picsum.photos/seed/besharam/300/300", mood: ["Party"], language: "Hindi" },
    { id: "t6", title: "Deva Deva", singers: ["Arijit Singh", "Jonita Gandhi"], duration: "4:39", thumbnail: "https://picsum.photos/seed/devadeva/300/300", mood: ["Motivational"], language: "Hindi" },
  ],
  trendingArtists: [
    { id: "a1", name: "Arijit Singh", genre: "Bollywood · Romantic", thumbnail: "https://picsum.photos/seed/arijit/300/300", monthlyListeners: "48M" },
    { id: "a2", name: "Shreya Ghoshal", genre: "Bollywood · Classical", thumbnail: "https://picsum.photos/seed/shreya/300/300", monthlyListeners: "32M" },
    { id: "a3", name: "Darshan Raval", genre: "Indie · Pop", thumbnail: "https://picsum.photos/seed/darshan/300/300", monthlyListeners: "19M" },
    { id: "a4", name: "Sid Sriram", genre: "Tamil · Soul", thumbnail: "https://picsum.photos/seed/sidsriram/300/300", monthlyListeners: "15M" },
    { id: "a5", name: "Jubin Nautiyal", genre: "Bollywood · Soft", thumbnail: "https://picsum.photos/seed/jubin/300/300", monthlyListeners: "22M" },
    { id: "a6", name: "Neha Kakkar", genre: "Bollywood · Peppy", thumbnail: "https://picsum.photos/seed/neha/300/300", monthlyListeners: "26M" },
  ],
  newAlbums: [
    { id: "al1", title: "Animal OST", singers: ["Bhupinder Babbal", "Raghav Chaitanya"], duration: "3:42", thumbnail: "https://picsum.photos/seed/animal/300/300", mood: ["Energetic"], language: "Hindi" },
    { id: "al2", title: "Dunki Drop", singers: ["Pritam", "Arijit Singh"], duration: "3:30", thumbnail: "https://picsum.photos/seed/dunki/300/300", mood: ["Warm"], language: "Hindi" },
    { id: "al3", title: "Rocky Aur Rani", singers: ["Arijit Singh", "Shreya Ghoshal"], duration: "4:00", thumbnail: "https://picsum.photos/seed/rocky/300/300", mood: ["Romantic"], language: "Hindi" },
    { id: "al4", title: "Jawan Prevue", singers: ["Anirudh Ravichander"], duration: "2:55", thumbnail: "https://picsum.photos/seed/jawan/300/300", mood: ["Energetic"], language: "Tamil" },
  ],
};

