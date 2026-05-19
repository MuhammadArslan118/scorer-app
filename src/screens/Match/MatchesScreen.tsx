import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useMatchStore } from '../../store/matchStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import { formatMatchResult } from '../../utils/format';

export function MatchesScreen({ navigation }: any) {
  const colors = useColors();
  const { matches } = useMatchStore();

  const renderMatch = ({ item: match }: any) => (
    <TouchableOpacity
      onPress={() => {
        if (match.status === 'live') {
          navigation.navigate('LiveScoring', { matchId: match.id });
        } else {
          navigation.navigate('Scorecard', { matchId: match.id });
        }
      }}
    >
      <Card>
        <View style={styles.matchHeader}>
          <Text style={[styles.matchTitle, { color: colors.text }]}>
            {match.title}
          </Text>
          {match.status === 'live' && (
            <View style={[styles.liveBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.venue, { color: colors.textSecondary }]}>
          {match.venue} · {match.format}
        </Text>
        {match.teams.map((team: any) => {
          const inns = match.innings.find((i: any) => i.teamId === team.id);
          return (
            <View key={team.id} style={styles.scoreRow}>
              <Text style={[styles.teamName, { color: colors.text }]}>
                {team.shortName}
              </Text>
              <Text style={[styles.score, { color: colors.text }]}>
                {inns ? `${inns.totalRuns}/${inns.totalWickets}` : '-'}
              </Text>
            </View>
          );
        })}
        <Text style={[styles.result, { color: colors.primary }]}>
          {formatMatchResult(match)}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(match.date)}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Matches</Text>
            <Button
              title="+ New Match"
              onPress={() => navigation.navigate('CreateMatch')}
              size="small"
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800' },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  venue: { fontSize: 12, marginBottom: 8 },
  liveBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  teamName: { fontSize: 15, fontWeight: '600' },
  score: { fontSize: 16, fontWeight: '700' },
  result: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  date: { fontSize: 11, marginTop: 4 },
});
