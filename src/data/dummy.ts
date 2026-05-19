import { Player, Team, Match, Activity } from '../types';

export const DUMMY_PLAYERS: Player[] = [
  { id: 'p1', name: 'Virat Sharma', role: 'batsman', battingStyle: 'right-handed', teamId: 't1' },
  { id: 'p2', name: 'Rohit Singh', role: 'batsman', battingStyle: 'right-handed', teamId: 't1' },
  { id: 'p3', name: 'Surya Yadav', role: 'batsman', battingStyle: 'right-handed', teamId: 't1' },
  { id: 'p4', name: 'KL Rahul', role: 'wicket-keeper', battingStyle: 'right-handed', teamId: 't1' },
  { id: 'p5', name: 'Hardik Pandya', role: 'all-rounder', battingStyle: 'right-handed', bowlingStyle: 'medium', teamId: 't1' },
  { id: 'p6', name: 'Ravindra Jadeja', role: 'all-rounder', battingStyle: 'left-handed', bowlingStyle: 'spin', teamId: 't1' },
  { id: 'p7', name: 'Jasprit Bumrah', role: 'bowler', bowlingStyle: 'fast', teamId: 't1' },
  { id: 'p8', name: 'Mohammed Shami', role: 'bowler', bowlingStyle: 'fast', teamId: 't1' },
  { id: 'p9', name: 'Yuzi Chahal', role: 'bowler', bowlingStyle: 'spin', teamId: 't1' },
  { id: 'p10', name: 'Shubman Gill', role: 'batsman', battingStyle: 'right-handed', teamId: 't1' },
  { id: 'p11', name: 'Rishabh Pant', role: 'wicket-keeper', battingStyle: 'left-handed', teamId: 't1' },
  { id: 'p12', name: 'Pat Cummins', role: 'bowler', bowlingStyle: 'fast', teamId: 't2' },
  { id: 'p13', name: 'Steve Smith', role: 'batsman', battingStyle: 'right-handed', teamId: 't2' },
  { id: 'p14', name: 'David Warner', role: 'batsman', battingStyle: 'left-handed', teamId: 't2' },
  { id: 'p15', name: 'Mitchell Starc', role: 'bowler', bowlingStyle: 'fast', teamId: 't2' },
  { id: 'p16', name: 'Glenn Maxwell', role: 'all-rounder', battingStyle: 'right-handed', bowlingStyle: 'spin', teamId: 't2' },
  { id: 'p17', name: 'Alex Carey', role: 'wicket-keeper', battingStyle: 'left-handed', teamId: 't2' },
  { id: 'p18', name: 'Josh Hazlewood', role: 'bowler', bowlingStyle: 'fast', teamId: 't2' },
  { id: 'p19', name: 'Marnus Labuschagne', role: 'batsman', battingStyle: 'right-handed', teamId: 't2' },
  { id: 'p20', name: 'Nathan Lyon', role: 'bowler', bowlingStyle: 'spin', teamId: 't2' },
  { id: 'p21', name: 'Cameron Green', role: 'all-rounder', battingStyle: 'right-handed', bowlingStyle: 'medium', teamId: 't2' },
  { id: 'p22', name: 'Travis Head', role: 'batsman', battingStyle: 'left-handed', teamId: 't2' },
];

export const DUMMY_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Mumbai Strikers',
    shortName: 'MUM',
    players: DUMMY_PLAYERS.filter((p) => p.teamId === 't1'),
  },
  {
    id: 't2',
    name: 'Sydney Thunder',
    shortName: 'SYD',
    players: DUMMY_PLAYERS.filter((p) => p.teamId === 't2'),
  },
];

export const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'match',
    title: 'Mumbai Strikers vs Sydney Thunder',
    description: 'Mumbai Strikers won by 24 runs',
    matchId: 'm1',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'u1',
  },
  {
    id: 'a2',
    type: 'milestone',
    title: 'Virat Sharma scored 50',
    description: 'Completed half-century off 32 balls',
    matchId: 'm1',
    timestamp: new Date(Date.now() - 7200000),
    userId: 'u1',
  },
  {
    id: 'a3',
    type: 'milestone',
    title: 'Pat Cummins takes 4 wickets',
    description: 'Best bowling figures of the season',
    matchId: 'm1',
    timestamp: new Date(Date.now() - 10800000),
    userId: 'u1',
  },
];

export const DUMMY_MATCHES: Match[] = [
  {
    id: 'm1',
    title: 'Champions Trophy Final',
    format: 'T20',
    overs: 20,
    venue: 'Wankhede Stadium, Mumbai',
    date: new Date(Date.now() - 86400000),
    teams: DUMMY_TEAMS,
    innings: [
      {
        id: 'i1',
        teamId: 't1',
        battingOrder: ['p1', 'p10', 'p4', 'p2', 'p5', 'p6', 'p11', 'p7', 'p8', 'p9', 'p3'],
        bowlingOrder: ['p7', 'p8', 'p5', 'p9', 'p6'],
        overs: [
          {
            overNumber: 1,
            balls: [
              { id: 'b1', overNumber: 1, ballNumber: 1, batsmanId: 'p1', bowlerId: 'p12', runs: 1, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b2', overNumber: 1, ballNumber: 2, batsmanId: 'p10', bowlerId: 'p12', runs: 4, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b3', overNumber: 1, ballNumber: 3, batsmanId: 'p10', bowlerId: 'p12', runs: 0, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b4', overNumber: 1, ballNumber: 4, batsmanId: 'p10', bowlerId: 'p12', runs: 6, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b5', overNumber: 1, ballNumber: 5, batsmanId: 'p10', bowlerId: 'p12', runs: 1, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b6', overNumber: 1, ballNumber: 6, batsmanId: 'p1', bowlerId: 'p12', runs: 2, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
            ],
            totalRuns: 14,
            isMaiden: false,
            bowlerId: 'p12',
          },
          {
            overNumber: 2,
            balls: [
              { id: 'b7', overNumber: 2, ballNumber: 1, batsmanId: 'p1', bowlerId: 'p15', runs: 1, isWide: true, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b8', overNumber: 2, ballNumber: 2, batsmanId: 'p1', bowlerId: 'p15', runs: 4, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b9', overNumber: 2, ballNumber: 3, batsmanId: 'p10', bowlerId: 'p15', runs: 0, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: false },
              { id: 'b10', overNumber: 2, ballNumber: 4, batsmanId: 'p10', bowlerId: 'p15', runs: 0, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isWicket: true, wicketType: 'caught', fielderId: 'p14' },
            ],
            totalRuns: 6,
            isMaiden: false,
            bowlerId: 'p15',
          },
        ],
        totalRuns: 20,
        totalWickets: 1,
        extras: { wides: 1, noBalls: 0, byes: 0, legByes: 0, total: 1 },
        isComplete: true,
      },
    ],
    currentInnings: 0,
    status: 'live',
    tossWinner: 't1',
    tossDecision: 'bat',
    createdBy: 'u1',
    isPublic: true,
  },
];
