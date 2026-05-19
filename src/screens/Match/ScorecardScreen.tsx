import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SectionList,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useMatchStore } from '../../store/matchStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  getBattingStats,
  getBowlingStats,
  getPartnerships,
  getFallOfWickets,
  calculateRunRate,
  isLegalDelivery,
  getOverDisplay,
} from '../../utils/cricket';
import { formatMatchResult } from '../../utils/format';
import { BattingStats, BowlingStats } from '../../types';

export function ScorecardScreen({ route, navigation }: any) {
  const colors = useColors();
  const matchId = route?.params?.matchId;
  const match = useMatchStore((s) =>
    s.matches.find((m) => m.id === matchId)
  );

  if (!match) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Match not found</Text>
      </View>
    );
  }

  const result = formatMatchResult(match);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Match Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {match.title}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {match.format} · {match.venue} · {match.overs} Overs
        </Text>
        {match.status === 'completed' && (
          <Text style={[styles.result, { color: colors.primary }]}>
            {result}
          </Text>
        )}
      </View>

      {/* Innings */}
      {match.innings.map((innings) => {
        const team = match.teams.find((t) => t.id === innings.teamId);
        const allBalls = innings.overs.flatMap((o) => o.balls);
        const legalBalls = allBalls.filter(isLegalDelivery);
        const overs = getOverDisplay(legalBalls.length);

        const battingStatsMap = new Map<string, BattingStats>();
        const bowlingStatsMap = new Map<string, BowlingStats>();

        const batsmanIds = [...new Set(allBalls.map((b) => b.batsmanId))];
        for (const pid of batsmanIds) {
          battingStatsMap.set(pid, getBattingStats(pid, innings));
        }

        const bowlerIds = innings.bowlingOrder.filter((id) =>
          innings.overs.some((o) => o.bowlerId === id)
        );
        for (const pid of bowlerIds) {
          bowlingStatsMap.set(pid, getBowlingStats(pid, innings));
        }

        const partnerships = getPartnerships(innings);
        const fow = getFallOfWickets(innings);
        const runRate = calculateRunRate(innings.totalRuns, legalBalls.length);

        return (
          <View key={innings.id} style={styles.inningsBlock}>
            <Card>
              <Text style={[styles.inningsTitle, { color: colors.text }]}>
                {team?.name || 'Unknown'} Innings
              </Text>
              <View style={styles.inningsSummary}>
                <View>
                  <Text style={[styles.bigScore, { color: colors.text }]}>
                    {innings.totalRuns}/{innings.totalWickets}
                  </Text>
                  <Text style={[styles.oversText, { color: colors.textSecondary }]}>
                    {overs} Overs · RR: {runRate}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.extrasText, { color: colors.textSecondary }]}>
                    Extras: {innings.extras.total}
                    {' '}(Wd {innings.extras.wides}, NB {innings.extras.noBalls}, B {innings.extras.byes})
                  </Text>
                </View>
              </View>
            </Card>

            {/* Batting Table */}
            <Card title="Batting">
              <View style={styles.tableHeader}>
                <Text style={[styles.thName, { color: colors.textSecondary }]}>Batter</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>R</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>B</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>4s</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>6s</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>SR</Text>
              </View>
              {batsmanIds.map((pid) => {
                const stats = battingStatsMap.get(pid)!;
                const player = team?.players.find((p) => p.id === pid);
                return (
                  <View key={pid} style={styles.tableRow}>
                    <Text style={[styles.tdName, { color: colors.text }]}>
                      {player?.name || 'Unknown'}
                      {stats.isOut ? '' : '*'}
                      {stats.dismissalType ? (
                        <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                          {' '}b {stats.dismissalBowlerId
                            ? team?.players.find(p => p.id === stats.dismissalBowlerId)?.name?.split(' ').pop()
                            : ''}
                        </Text>
                      ) : (
                        <Text style={{ color: colors.primary, fontSize: 11 }}> not out</Text>
                      )}
                    </Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>{stats.runs}</Text>
                    <Text style={[styles.tdStat, { color: colors.textSecondary }]}>{stats.ballsFaced}</Text>
                    <Text style={[styles.tdStat, { color: colors.four }]}>{stats.fours}</Text>
                    <Text style={[styles.tdStat, { color: colors.six }]}>{stats.sixes}</Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>
                      {calculateRunRate(stats.runs, stats.ballsFaced).toFixed(1)}
                    </Text>
                  </View>
                );
              })}
            </Card>

            {/* Bowling Table */}
            <Card title="Bowling">
              <View style={styles.tableHeader}>
                <Text style={[styles.thName, { color: colors.textSecondary }]}>Bowler</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>O</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>M</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>R</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>W</Text>
                <Text style={[styles.thStat, { color: colors.textSecondary }]}>Econ</Text>
              </View>
              {bowlerIds.map((pid) => {
                const stats = bowlingStatsMap.get(pid)!;
                const player = team?.players.find((p) => p.id === pid);
                if (!stats) return null;
                return (
                  <View key={pid} style={styles.tableRow}>
                    <Text style={[styles.tdName, { color: colors.text }]}>
                      {player?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>
                      {getOverDisplay(Math.round(stats.balls))}
                    </Text>
                    <Text style={[styles.tdStat, { color: colors.textSecondary }]}>{stats.maidens}</Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>{stats.runs}</Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>{stats.wickets}</Text>
                    <Text style={[styles.tdStat, { color: colors.text }]}>
                      {calculateRunRate(stats.runs, stats.balls).toFixed(1)}
                    </Text>
                  </View>
                );
              })}
            </Card>

            {/* Extras */}
            <Card title="Extras">
              <View style={styles.extrasRow}>
                <Text style={[styles.extrasItem, { color: colors.text }]}>
                  Byes: {innings.extras.byes}
                </Text>
                <Text style={[styles.extrasItem, { color: colors.text }]}>
                  Leg Byes: {innings.extras.legByes}
                </Text>
                <Text style={[styles.extrasItem, { color: colors.text }]}>
                  Wides: {innings.extras.wides}
                </Text>
                <Text style={[styles.extrasItem, { color: colors.text }]}>
                  No Balls: {innings.extras.noBalls}
                </Text>
                <Text style={[styles.extrasItem, { color: colors.text, fontWeight: '700' }]}>
                  Total: {innings.extras.total}
                </Text>
              </View>
            </Card>

            {/* Fall of Wickets */}
            {fow.length > 0 && (
              <Card title="Fall Of Wickets">
                <View style={styles.fowRow}>
                  {fow.map((w) => (
                    <Text key={w.wicketNumber} style={[styles.fowItem, { color: colors.text }]}>
                      {w.wicketNumber}. {innings.totalRuns}/{w.wicketNumber} ({w.overAtDismissal} ov)
                    </Text>
                  ))}
                </View>
              </Card>
            )}
          </View>
        );
      })}

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
        style={{ marginTop: 16 }}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  header: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  meta: { fontSize: 13, marginTop: 4 },
  result: { fontSize: 15, fontWeight: '700', marginTop: 8 },
  inningsBlock: { marginBottom: 24 },
  inningsTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  inningsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bigScore: { fontSize: 32, fontWeight: '900' },
  oversText: { fontSize: 13, marginTop: 2 },
  extrasText: { fontSize: 12, textAlign: 'right' },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  thName: { flex: 2, fontSize: 12, fontWeight: '600' },
  thStat: { flex: 1, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  tdName: { flex: 2, fontSize: 13, fontWeight: '600' },
  tdStat: { flex: 1, fontSize: 13, textAlign: 'center' },
  extrasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  extrasItem: { fontSize: 13 },
  fowRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fowItem: { fontSize: 12 },
});
