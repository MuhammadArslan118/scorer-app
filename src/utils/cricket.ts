import { Ball, BattingStats, BowlingStats, Innings, Partnership, FallOfWicket } from '../types';

export const BALLS_PER_OVER = 6;

export function getOverDisplay(balls: number): string {
  const overs = Math.floor(balls / BALLS_PER_OVER);
  const remaining = balls % BALLS_PER_OVER;
  return `${overs}.${remaining}`;
}

export function getOverFromBalls(balls: number): number {
  return Math.floor(balls / BALLS_PER_OVER) + (balls % BALLS_PER_OVER) / 10;
}

export function calculateRunRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  const overs = balls / BALLS_PER_OVER;
  return parseFloat((runs / overs).toFixed(2));
}

export function calculateEconomy(runs: number, balls: number): number {
  if (balls === 0) return 0;
  const overs = balls / BALLS_PER_OVER;
  return parseFloat((runs / overs).toFixed(2));
}

export function calculateStrikeRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
}

export function isLegalDelivery(ball: Ball): boolean {
  return !ball.isWide && !ball.isNoBall;
}

export function getBallRuns(ball: Ball): number {
  let total = ball.runs;
  if (ball.isWide) total += 1;
  if (ball.isNoBall) total += 1;
  return total;
}

export function getBattingStats(
  playerId: string,
  innings: Innings
): BattingStats {
  const balls = innings.overs.flatMap((o) => o.balls).filter((b) => b.batsmanId === playerId);
  const legalBalls = balls.filter(isLegalDelivery);

  const stats: BattingStats = {
    playerId,
    runs: balls.reduce((sum, b) => sum + b.runs, 0),
    ballsFaced: legalBalls.length,
    fours: balls.filter((b) => b.runs === 4 && isLegalDelivery(b)).length,
    sixes: balls.filter((b) => b.runs === 6 && isLegalDelivery(b)).length,
    isOut: balls.some((b) => b.isWicket && b.batsmanId === playerId),
  };

  const wicketBall = balls.find((b) => b.isWicket);
  if (wicketBall) {
    stats.dismissalType = wicketBall.wicketType;
    stats.dismissalBowlerId = wicketBall.bowlerId;
    stats.dismissalFielderId = wicketBall.fielderId;
  }

  return stats;
}

export function getBowlingStats(
  playerId: string,
  innings: Innings
): BowlingStats {
  const overs = innings.overs.filter((o) => o.bowlerId === playerId);
  const allBalls = overs.flatMap((o) => o.balls);
  const legalBalls = allBalls.filter(isLegalDelivery);
  const maidens = overs.filter((o) => {
    const runsInOver = o.balls.reduce((sum, b) => sum + getBallRuns(b), 0);
    return runsInOver === 0 && o.balls.length === BALLS_PER_OVER;
  }).length;

  return {
    playerId,
    overs: overs.length + (legalBalls.filter((b) => b.overNumber === overs.length).length % BALLS_PER_OVER) / 10,
    balls: legalBalls.length,
    maidens,
    runs: allBalls.reduce((sum, b) => sum + getBallRuns(b), 0),
    wickets: allBalls.filter((b) => b.isWicket).length,
    wides: allBalls.filter((b) => b.isWide).length,
    noBalls: allBalls.filter((b) => b.isNoBall).length,
  };
}

export function getPartnerships(innings: Innings): Partnership[] {
  const partnerships: Partnership[] = [];
  const allBalls = innings.overs.flatMap((o) => o.balls);

  if (allBalls.length === 0) return [];

  let currentBatsman1 = allBalls[0].batsmanId;
  let currentBatsman2 = '';
  let partnershipRuns = 0;
  let partnershipBalls = 0;
  let lastBatsmanAtCrease = currentBatsman1;

  for (const ball of allBalls) {
    if (ball.batsmanId !== currentBatsman1 && ball.batsmanId !== currentBatsman2) {
      if (currentBatsman2 === '') {
        currentBatsman2 = ball.batsmanId;
      } else if (ball.batsmanId !== lastBatsmanAtCrease) {
        partnerships.push({
          batsman1Id: currentBatsman1,
          batsman2Id: currentBatsman2,
          runs: partnershipRuns,
          balls: partnershipBalls,
        });
        currentBatsman1 = ball.batsmanId;
        currentBatsman2 = lastBatsmanAtCrease;
        partnershipRuns = 0;
        partnershipBalls = 0;
      }
    }

    if (ball.isWicket) {
      partnerships.push({
        batsman1Id: currentBatsman1,
        batsman2Id: currentBatsman2,
        runs: partnershipRuns,
        balls: partnershipBalls,
      });
      partnershipRuns = 0;
      partnershipBalls = 0;
    }

    if (!ball.isWide) {
      partnershipRuns += ball.runs;
      partnershipBalls++;
    }

    lastBatsmanAtCrease = ball.batsmanId;

    if (ball.runs % 2 === 1 && !ball.isWide && !ball.isNoBall) {
      const temp = currentBatsman1;
      currentBatsman1 = currentBatsman2;
      currentBatsman2 = temp;
    }
  }

  return partnerships;
}

export function getFallOfWickets(innings: Innings): FallOfWicket[] {
  const fow: FallOfWicket[] = [];
  let wicketNumber = 0;
  let cumulativeRuns = 0;

  for (const over of innings.overs) {
    for (const ball of over.balls) {
      cumulativeRuns += getBallRuns(ball);
      if (ball.isWicket) {
        wicketNumber++;
        fow.push({
          wicketNumber,
          playerId: ball.batsmanId,
          runsAtDismissal: cumulativeRuns,
          overAtDismissal: over.overNumber + ball.ballNumber / 10,
        });
      }
    }
  }

  return fow;
}

export function getStriker(
  ball: Ball,
  currentStrikerId: string,
  currentNonStrikerId: string
): { strikerId: string; nonStrikerId: string } {
  let strikerId = currentStrikerId;
  let nonStrikerId = currentNonStrikerId;
  const runs = ball.runs;

  if (ball.isWicket) {
    strikerId = ball.batsmanId;
    nonStrikerId = currentNonStrikerId;
  } else if (runs % 2 === 1) {
    strikerId = currentNonStrikerId;
    nonStrikerId = currentStrikerId;
  }

  return { strikerId, nonStrikerId };
}

export function getRequiredRunRate(runsRequired: number, ballsRemaining: number): number {
  if (ballsRemaining === 0) return 0;
  const oversRemaining = ballsRemaining / BALLS_PER_OVER;
  return parseFloat((runsRequired / oversRemaining).toFixed(2));
}

export function getProjectedScore(runs: number, balls: number, wickets: number, totalOvers: number): number {
  if (balls === 0 || wickets >= 10) return runs;
  const totalBalls = totalOvers * BALLS_PER_OVER;
  const remainingBalls = totalBalls - balls;
  const runRate = calculateRunRate(runs, balls);
  const projectedRuns = runs + (remainingBalls * runRate) / BALLS_PER_OVER;
  return Math.round(projectedRuns);
}
