import { Team, Level, Submission } from "@/types";

// Generate timestamps for realistic progress data
const now = Date.now();
const hour = 3600000;

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Binary Bandits",
    members: ["Alice Rahman", "Bob Khan", "Charlie Hasan"],
    theme: "dark",
    progress: [
      { level: 1, timestamp: now - 5 * hour },
      { level: 2, timestamp: now - 4 * hour },
      { level: 3, timestamp: now - 2 * hour },
    ],
    createdAt: now - 6 * hour,
  },
  {
    id: "team-2",
    name: "Code Crusaders",
    members: ["David Akter", "Eve Begum"],
    theme: "dark",
    progress: [
      { level: 1, timestamp: now - 4.5 * hour },
      { level: 2, timestamp: now - 3 * hour },
    ],
    createdAt: now - 5 * hour,
  },
  {
    id: "team-3",
    name: "Syntax Slayers",
    members: ["Frank Uddin", "Grace Sultana", "Henry Chowdhury", "Ivy Nahar"],
    theme: "light",
    progress: [
      { level: 1, timestamp: now - 3 * hour },
      { level: 2, timestamp: now - 2.5 * hour },
      { level: 3, timestamp: now - 1.5 * hour },
      { level: 4, timestamp: now - 0.5 * hour },
    ],
    createdAt: now - 4 * hour,
  },
  {
    id: "team-4",
    name: "Debug Dragons",
    members: ["Jack Mia", "Kate Islam"],
    theme: "dark",
    progress: [{ level: 1, timestamp: now - 1 * hour }],
    createdAt: now - 2 * hour,
  },
];

export const mockLevels: Level[] = [
  {
    levelId: 1,
    title: "The Beginning",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    description:
      "Every journey begins with a single step. Decode the binary message hidden in the circuit board to find your first clue.",
    correctAnswer: "CIRCUIT",
  },
  {
    levelId: 2,
    title: "Lost in Translation",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    description:
      "Ancient scripts meet modern code. The answer lies where languages converge.",
    attachment: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    correctAnswer: "BABEL",
  },
  {
    levelId: 3,
    title: "Network Maze",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    description:
      "Navigate through the network of possibilities. Each node holds a secret.",
    correctAnswer: "PACKET",
  },
  {
    levelId: 4,
    title: "The Final Key",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    description:
      "All paths lead here. Combine your knowledge to unlock the final treasure.",
    attachment: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    correctAnswer: "TREASURE",
  },
];

export const mockSubmissions: Submission[] = [
  // Team 1 submissions
  {
    id: "sub-1",
    teamId: "team-1",
    level: 1,
    submittedAnswer: "CIRCUIT",
    isCorrect: true,
    timestamp: now - 5 * hour,
  },
  {
    id: "sub-2",
    teamId: "team-1",
    level: 2,
    submittedAnswer: "TOWER",
    isCorrect: false,
    timestamp: now - 4.5 * hour,
  },
  {
    id: "sub-3",
    teamId: "team-1",
    level: 2,
    submittedAnswer: "BABEL",
    isCorrect: true,
    timestamp: now - 4 * hour,
  },
  {
    id: "sub-4",
    teamId: "team-1",
    level: 3,
    submittedAnswer: "PACKET",
    isCorrect: true,
    timestamp: now - 2 * hour,
  },
  // Team 2 submissions
  {
    id: "sub-5",
    teamId: "team-2",
    level: 1,
    submittedAnswer: "CIRCUIT",
    isCorrect: true,
    timestamp: now - 4.5 * hour,
  },
  {
    id: "sub-6",
    teamId: "team-2",
    level: 2,
    submittedAnswer: "BABEL",
    isCorrect: true,
    timestamp: now - 3 * hour,
  },
  // Team 3 submissions
  {
    id: "sub-7",
    teamId: "team-3",
    level: 1,
    submittedAnswer: "CIRCUIT",
    isCorrect: true,
    timestamp: now - 3 * hour,
  },
  {
    id: "sub-8",
    teamId: "team-3",
    level: 2,
    submittedAnswer: "BABEL",
    isCorrect: true,
    timestamp: now - 2.5 * hour,
  },
  {
    id: "sub-9",
    teamId: "team-3",
    level: 3,
    submittedAnswer: "NODE",
    isCorrect: false,
    timestamp: now - 2 * hour,
  },
  {
    id: "sub-10",
    teamId: "team-3",
    level: 3,
    submittedAnswer: "PACKET",
    isCorrect: true,
    timestamp: now - 1.5 * hour,
  },
  {
    id: "sub-11",
    teamId: "team-3",
    level: 4,
    submittedAnswer: "TREASURE",
    isCorrect: true,
    timestamp: now - 0.5 * hour,
  },
  // Team 4 submissions
  {
    id: "sub-12",
    teamId: "team-4",
    level: 1,
    submittedAnswer: "BINARY",
    isCorrect: false,
    timestamp: now - 1.5 * hour,
  },
  {
    id: "sub-13",
    teamId: "team-4",
    level: 1,
    submittedAnswer: "CIRCUIT",
    isCorrect: true,
    timestamp: now - 1 * hour,
  },
];
