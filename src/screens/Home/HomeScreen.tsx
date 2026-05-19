import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useMatchStore } from '../../store/matchStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import { formatMatchResult } from '../../utils/format';
import { DUMMY_ACTIVITIES } from '../../data/dummy';
import { SIZES } from '../../constants/theme';
import { Match, Activity } from '../../types';

export function HomeScreen({ navigation }: any) {
  const colors = useColors();
  const { matches } = useMatchStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const activeMatches = matches.filter((m) => m.status === 'live');
  const recentMatches = matches.filter((m) => m.status === 'completed').slice(0, 5);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Hello,
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || 'Cricket Fan'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar name={user?.name || 'U'} size={48} />
        </TouchableOpacity>
      </View>

      {activeMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Live Matches
          </Text>
          {activeMatches.map((match) => (
            <TouchableOpacity
              key={match.id}
              onPress={() => navigation.navigate('LiveScoring', { matchId: match.id })}
            >
              <LiveMatchCard match={match} colors={colors} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Matches
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        {recentMatches.length > 0 ? (
          recentMatches.map((match) => (
            <TouchableOpacity
              key={match.id}
              onPress={() => navigation.navigate('Scorecard', { matchId: match.id })}
            >
              <MatchCard match={match} colors={colors} />
            </TouchableOpacity>
          ))
        ) : (
          <Card>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No matches yet. Create your first match!
            </Text>
            <Button
              title="Create Match"
              onPress={() => navigation.navigate('CreateMatch')}
              style={{ marginTop: 12 }}
            />
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Activity Feed
        </Text>
        {DUMMY_ACTIVITIES.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} colors={colors} />
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function LiveMatchCard({ match, colors }: { match: Match; colors: any }) {
  const inns = match.innings[match.currentInnings];
  return (
    <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.error }}>
      <View style={gmstyles.matchHeader}>
        <Text style={[gmstyles.matchTitle, { color: colors.text }]}>
          {match.title}
        </Text>
        <View style={[gmstyles.liveBadge, { backgroundColor: colors.error }]}>
          <Text style={gmstyles.liveText}>LIVE</Text>
        </View>
      </View>
      {match.teams.map((team) => {
        const teamInns = match.innings.find((i) => i.teamId === team.id);
        return (
          <View key={team.id} style={gmstyles.scoreRow}>
            <Text style={[gmstyles.teamName, { color: colors.text }]}>
              {team.shortName}
            </Text>
            <Text style={[gmstyles.score, { color: colors.text }]}>
              {teamInns ? `${teamInns.totalRuns}/${teamInns.totalWickets}` : '-'}
              <Text style={[gmstyles.overs, { color: colors.textSecondary }]}>
                {' '}
                ({teamInns ? (teamInns.overs.length || 0) + '.' + (teamInns.overs[teamInns.overs.length - 1]?.balls.length || 0) : '0.0'})
              </Text>
            </Text>
          </View>
        );
      })}
    </Card>
  );
}

function MatchCard({ match, colors }: { match: Match; colors: any }) {
  const result = formatMatchResult(match);
  return (
    <Card>
      <Text style={[gmstyles.matchTitle, { color: colors.text }]}>
        {match.title}
      </Text>
      <Text style={[gmstyles.venue, { color: colors.textSecondary }]}>
        {match.venue} · {match.format}
      </Text>
      {match.teams.map((team) => {
        const teamInns = match.innings.find((i) => i.teamId === team.id);
        return (
          <View key={team.id} style={gmstyles.scoreRow}>
            <Text style={[gmstyles.teamName, { color: colors.text }]}>
              {team.shortName}
            </Text>
            <Text style={[gmstyles.score, { color: colors.text }]}>
              {teamInns ? `${teamInns.totalRuns}/${teamInns.totalWickets}` : '-'}
            </Text>
          </View>
        );
      })}
      <Text style={[gmstyles.result, { color: colors.primary }]}>
        {result}
      </Text>
      <Text style={[gmstyles.date, { color: colors.textSecondary }]}>
        {formatDate(match.date)}
      </Text>
    </Card>
  );
}

function ActivityCard({ activity, colors }: { activity: Activity; colors: any }) {
  const iconMap: Record<string, string> = {
    match: '🏏',
    milestone: '⭐',
    achievement: '🏆',
  };

  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={gmstyles.activityIcon}>
        {iconMap[activity.type] || '📋'}
      </Text>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[gmstyles.activityTitle, { color: colors.text }]}>
          {activity.title}
        </Text>
        <Text style={[gmstyles.activityDesc, { color: colors.textSecondary }]}>
          {activity.description}
        </Text>
        <Text style={[gmstyles.date, { color: colors.textSecondary }]}>
          {formatDate(activity.timestamp)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: '800' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  seeAll: { fontSize: 14, fontWeight: '600' },
  emptyText: { fontSize: 14, textAlign: 'center' },
});

const gmstyles = StyleSheet.create({
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  venue: { fontSize: 12, marginBottom: 8 },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  teamName: { fontSize: 15, fontWeight: '600' },
  score: { fontSize: 16, fontWeight: '700' },
  overs: { fontSize: 12, fontWeight: '400' },
  result: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  date: { fontSize: 11, marginTop: 4 },
  activityIcon: { fontSize: 24 },
  activityTitle: { fontSize: 14, fontWeight: '600' },
  activityDesc: { fontSize: 12 },
});
