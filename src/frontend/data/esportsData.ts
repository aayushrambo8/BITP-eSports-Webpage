export interface ClubGame {
  id: string;
  name: string;
  tag: string;
  divisionBadge: string;
  category: 'CONSOLE' | 'PC' | 'MOBILE';
  description: string;
  captain: string;
  practiceSchedule: string;
  status: string;
  statusType: 'open' | 'scrims' | 'active' | 'recruiting';
  league: string;
  accentColor: string;
  badgeBg: string;
  gameArt: string;
  tagline: string;
}

export interface ScheduledMatch {
  id: string;
  discipline: string;
  datetime: string;
  timestamp: string;
  opponent: string;
  league: string;
  streamType: 'Twitch Stream' | 'Watch Party' | 'Live Broadcast';
  streamUrl?: string;
}

export interface WeeklyScheduleItem {
  id: string;
  tag: string;
  title: string;
  time: string;
  location: string;
  details: string;
}

export interface RecentResult {
  id: string;
  discipline: string;
  league: string;
  badge: 'WIN' | 'SWEEP' | 'COMPLETED' | 'LOSS';
  team1: string;
  score1: number | string;
  team2: string;
  score2: number | string;
  subtext: string;
}

export interface TournamentEvent {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  isoDate: string;
  discipline: string;
  location: string;
  locationSub: string;
  format: string;
  formatSub: string;
  statusBadge: string;
  description?: string;
  slotsFilled?: number;
  slotsTotal?: number;
}

export interface ClubOfficer {
  name: string;
  handle: string;
  role: string;
  yearMajor: string;
  tag: string;
  discord: string;
  imageUrl: string;
}

export interface ClubTeamMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  gameSlug: string;
  yearMajor: string;
  tag: string;
  imageUrl: string;
  order: number;
}

export interface ClubAchievement {
  id: string;
  title: string;
  game: string;
  award: string;
  date: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  topic?: string | null;
  game?: string | null;
  message: string;
  status: 'PENDING' | 'READ';
  createdAt: string;
}

// -------------------------------------------------------------
// ABOUT US CONFIGURABLE ASSETS & IMAGES
// -------------------------------------------------------------
export const ABOUT_PAGE_ASSETS = {
  photo1: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  photo1Caption: 'FIG 01 // COLLEGIATE ESPORTS ARENA',
  photo2: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  photo2Caption: 'FIG 02 // LIVESTREAM SHOUTCAST STUDIO',
  photo3: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80',
  photo3Caption: 'FIG 03 // MOBILE & CONSOLE CHAMPIONSHIP',
};

// -------------------------------------------------------------
// CONTACT TOUCHPOINTS
// -------------------------------------------------------------
export const CONTACT_INFO = {
  instagramHandle: '@ApexEsportsClub',
  instagramUrl: 'https://instagram.com/apexesportsclub',
  mail: 'esportsclub@university.edu',
  scrimsMail: 'scrims.apex@university.edu',
  discordUrl: 'https://discord.gg/apexesports',
  officeHours: 'Tuesdays & Thursdays: 4:00 PM – 6:00 PM',
};

export const CLUB_PILLARS = [
  {
    code: '01 // COMP',
    title: 'Competitive Collegiate Teams',
    description: 'Fielding official teams across EA FC, Valorant, Free Fire, and BGMI in inter-college championships.',
    metaLeft: 'VARSITY & ROOKIE',
    metaRight: 'TRYOUTS SEASONAL',
  },
  {
    code: '02 // COMM',
    title: 'Casual & Community Gaming',
    description: 'Weekly campus lobbies, viewing parties, and casual matchmaking where any student can unwind and find teammates.',
    metaLeft: 'ALL MAJORS',
    metaRight: 'WEEKLY LOBBIES',
  },
  {
    code: '03 // PROD',
    title: 'Student Production & Broadcasting',
    description: 'Hands-on student training in tournament administration, shoutcasting, video streaming, and production operations.',
    metaLeft: 'RESUME VALUE',
    metaRight: 'STUDIO DESK',
  },
  {
    code: '04 // LEAD',
    title: 'Student Leadership & Community',
    description: 'Student-run organization providing management experience, campus representation, and peer mentorship.',
    metaLeft: 'STUDENT GOV',
    metaRight: 'CAMPUS WIDE',
  },
];

export const FAQS = [
  {
    id: 'q1',
    num: 'Q01 //',
    question: 'Do I have to be good at games to join?',
    answer: 'No! We have both competitive teams and a large casual community. Everyone is welcome regardless of skill level. From casual mobile lobbies to varsity qualifiers, you will find your community here.',
  },
  {
    id: 'q2',
    num: 'Q02 //',
    question: 'How do competitive team tryouts work?',
    answer: 'Tryouts for FC, Valorant, Free Fire, and BGMI are held at the beginning of each semester. Announcements and Google form links are posted in our Discord.',
  },
  {
    id: 'q3',
    num: 'Q03 //',
    question: 'How do scrim requests work for other colleges?',
    answer: 'Collegiate managers can reach out directly via our email (scrims.apex@university.edu) or through the Discord scrims channel. Our captains coordinate scrim blocks weekly.',
  },
  {
    id: 'q4',
    num: 'Q04 //',
    question: 'Can I propose a new game or tournament?',
    answer: 'Yes! Reach out via our Contact form with your game title and student interest. If there is active campus demand, our officers can charter a recognized division.',
  },
];
