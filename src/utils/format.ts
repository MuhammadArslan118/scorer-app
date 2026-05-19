export function formatDate(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatOvers(overs: number): string {
  const whole = Math.floor(overs);
  const decimal = Math.round((overs - whole) * 10);
  return `${whole}.${decimal}`;
}

export function truncateName(name: string, maxLength: number = 8): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 1) + '.';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function formatMatchResult(match: any): string {
  if (match.status === 'scheduled') return 'Match not started';
  if (match.status === 'abandoned') return 'Match abandoned';

  if (match.status === 'completed' && match.result) {
    return match.result;
  }

  const innings = match.innings?.[match.currentInnings];
  if (!innings) return 'Match in progress';

  const team1 = match.teams?.[0];
  const team2 = match.teams?.[1];
  if (!team1 || !team2) return 'Match in progress';

  const inns1 = match.innings?.[0];
  const inns2 = match.innings?.[1];

  if (inns1 && inns2) {
    if (inns2.totalRuns > inns1.totalRuns) {
      return `${team2.shortName} won by ${10 - inns2.totalWickets} wickets`;
    } else if (inns1.totalRuns > inns2.totalRuns) {
      return `${team1.shortName} won by ${inns1.totalRuns - inns2.totalRuns} runs`;
    }
    return 'Match tied';
  }

  return `${team1.shortName}: ${inns1?.totalRuns || 0}/${inns1?.totalWickets || 0}`;
}
