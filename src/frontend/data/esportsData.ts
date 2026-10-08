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
  posterUrl?: string | null;
  slotsFilled?: number;
  slotsTotal?: number;
}

export interface ClubOfficer {
  id: string;
  name: string;
  handle: string;
  role: string;
  rollNo: string;
  yearMajor: string;
  tag: string;
  discord: string;
  imageUrl: string;
  photoUrl?: string | null;
}

export const CLUB_OFFICER_PHOTOS: Record<string, string> = {
  'aayush arya': '/resources/people/aayush-arya-senior-coordinator.webp',
  'aayush babu': '/resources/people/aayush-babu-senior-coordinator.webp',
  'akshay kumar keshav': '/resources/people/akshay-kumar-keshav-junior-coordinator.webp',
  'amartya prakash': '/resources/people/amartya-prakash-junior-coordinator.webp',
  'asmit arya': '/resources/people/asmit-arya-junior-coordinator.webp',
  'aryan nirala': '/resources/people/aryan-nirala-junior-coordinator.webp',
  'daksha chandra': '/resources/people/daksha-chandra-junior-coordinator.webp',
  hridayesh: '/resources/people/hridayesh-junior-coordinator.webp',
  'kshitij tiwari': '/resources/people/kshitij-tiwari-senior-coordinator.webp',
  'kumar tanishq': '/resources/people/kumar-tanishq-junior-coordinator.webp',
  'suryansh garg': '/resources/people/suryansh-garg-junior-coordinator.webp',
};

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
  photo1: '/resources/about/esports-arena.jpg',
  photo2: '/resources/about/broadcast-studio.jpg',
  photo3: '/resources/about/campus-gaming.jpg',
};

export const LOCAL_GAME_ART: Record<string, string> = {
  'ea-fc': '/resources/games/eafc.svg',
  valorant: '/resources/games/valorant.svg',
  'free-fire': '/resources/games/free-fire.svg',
  bgmi: '/resources/games/bgmi.svg',
};

export const DEFAULT_CLUB_GAMES: ClubGame[] = [
  {
    id: 'ea-fc',
    name: 'EA Sports FC',
    tag: 'SPORTS SIMULATION',
    divisionBadge: 'PRO DIVISION',
    category: 'PC',
    description: 'Competitive virtual football roster participating in collegiate leagues and tournaments.',
    captain: 'Club Exec',
    practiceSchedule: 'TBD',
    status: 'Active Roster',
    statusType: 'active',
    league: 'Collegiate FIFA',
    accentColor: '#88c425',
    badgeBg: 'rgba(136, 196, 37, 0.15)',
    gameArt: LOCAL_GAME_ART['ea-fc'],
    tagline: 'The Pitch Belongs To BITP',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    tag: 'TACTICAL FPS',
    divisionBadge: 'PRO DIVISION',
    category: 'PC',
    description: 'Premier 5v5 tactical shooter roster competing in regional inter-college circuits.',
    captain: 'Club Exec',
    practiceSchedule: 'TBD',
    status: 'Active Roster',
    statusType: 'active',
    league: 'Campus Valorant League',
    accentColor: '#ff4655',
    badgeBg: 'rgba(255, 70, 85, 0.15)',
    gameArt: LOCAL_GAME_ART.valorant,
    tagline: 'Precision & Coordination',
  },
  {
    id: 'free-fire',
    name: 'Free Fire Mobile',
    tag: 'BATTLE ROYALE',
    divisionBadge: 'MOBILE DIVISION',
    category: 'MOBILE',
    description: 'Fast-paced mobile battle royale squad representing BITP in campus championships.',
    captain: 'Club Exec',
    practiceSchedule: 'TBD',
    status: 'Active Roster',
    statusType: 'active',
    league: 'Free Fire Campus Series',
    accentColor: '#ff9900',
    badgeBg: 'rgba(255, 153, 0, 0.15)',
    gameArt: LOCAL_GAME_ART['free-fire'],
    tagline: 'Survive & Conquer',
  },
  {
    id: 'bgmi',
    name: 'BGMI',
    tag: 'BATTLE ROYALE',
    divisionBadge: 'MOBILE DIVISION',
    category: 'MOBILE',
    description: 'Dominant BGMI squad competing across university leagues and open scrims.',
    captain: 'Club Exec',
    practiceSchedule: 'TBD',
    status: 'Active Roster',
    statusType: 'active',
    league: 'BGMI Collegiate Circuit',
    accentColor: '#22c55e',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    gameArt: LOCAL_GAME_ART.bgmi,
    tagline: 'Winner Winner',
  },
];

export function localResourceImage(value: string | null | undefined, fallback: string): string {
  if (typeof value !== 'string' || !value.startsWith('/resources/') || value.includes('..')) return fallback;
  return value;
}

// -------------------------------------------------------------
// CONTACT TOUCHPOINTS
// -------------------------------------------------------------
export const CONTACT_INFO = {
  instagramHandle: '@BITPeSports',
  instagramUrl: 'https://www.instagram.com/bitpesports.gg/',
  mail: 'bitpesports.gg@gmail.com',
  scrimsMail: 'bitpesports.gg@gmail.com',
  discordUrl: 'https://discord.gg/rXHBTSDkcf'
};

export const CLUB_PILLARS = [
  {
    code: '01 // COMP',
    title: 'Competitive Collegiate Teams',
    description: 'Fielding teams across EA FC, Valorant, Free Fire, and BGMI in intra/inter-college championships.',
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
