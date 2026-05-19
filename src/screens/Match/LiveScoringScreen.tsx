import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useMatchStore } from '../../store/matchStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScoreCard } from '../../components/cricket/ScoreCard';
import { BallControl } from '../../components/cricket/BallControl';
import { OverSummary } from '../../components/cricket/OverSummary';
import { PlayerSelect } from '../../components/cricket/PlayerSelect';
import { getOverDisplay, isLegalDelivery } from '../../utils/cricket';
import { Ball, Match } from '../../types';

export function LiveScoringScreen({ route, navigation }: any) {
  const colors = useColors();
  const matchId = route?.params?.matchId;
  const { currentMatch, addBall, undoLastBall, setStriker, setBowler } = useMatchStore();

  const match = useMatchStore((s) =>
    s.matches.find((m) => m.id === matchId) || s.currentMatch
  );

  if (!match) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Match not found</Text>
      </View>
    );
  }

  const currentInnings = match.innings[match.currentInnings];
  const battingTeam = match.teams.find((t) => t.id === currentInnings?.teamId);
  const bowlingTeam = match.teams.find((t) => t.id !== currentInnings?.teamId);

  const [striker, setStrikerLocal] = useState(currentInnings?.battingOrder[0] || '');
  const [nonStriker, setNonStrikerLocal] = useState(currentInnings?.battingOrder[1] || '');
  const [bowler, setBowlerLocal] = useState(currentInnings?.bowlingOrder[0] || '');

  const allBalls = currentInnings?.overs.flatMap((o) => o.balls) || [];
  const legalBalls = allBalls.filter(isLegalDelivery);

  const currentOver = currentInnings?.overs[currentInnings.overs.length - 1];
  const isOverComplete = currentOver?.balls.length === 6;

  const handleBall = (type: string, value?: number) => {
    if (!striker || !bowler) {
      Alert.alert('Error', 'Please select striker and bowler');
      return;
    }

    if (type === 'runs' && value !== undefined) {
      addBall({
        overNumber: 0,
        ballNumber: 0,
        batsmanId: striker,
        bowlerId: bowler,
        runs: value,
        isWide: false,
        isNoBall: false,
        isBye: false,
        isLegBye: false,
        isWicket: false,
      });

      if (value % 2 === 1) {
        setStrikerLocal(nonStriker);
        setNonStrikerLocal(striker);
      }
    } else if (type === 'wide') {
      addBall({
        overNumber: 0,
        ballNumber: 0,
        batsmanId: striker,
        bowlerId: bowler,
        runs: 0,
        isWide: true,
        isNoBall: false,
        isBye: false,
        isLegBye: false,
        isWicket: false,
      });
    } else if (type === 'noball') {
      addBall({
        overNumber: 0,
        ballNumber: 0,
        batsmanId: striker,
        bowlerId: bowler,
        runs: 0,
        isWide: false,
        isNoBall: true,
        isBye: false,
        isLegBye: false,
        isWicket: false,
      });
    } else if (type === 'bye') {
      addBall({
        overNumber: 0,
        ballNumber: 0,
        batsmanId: striker,
        bowlerId: bowler,
        runs: 0,
        isWide: false,
        isNoBall: false,
        isBye: true,
        isLegBye: false,
        isWicket: false,
      });
    } else if (type === 'wicket') {
      addBall({
        overNumber: 0,
        ballNumber: 0,
        batsmanId: striker,
        bowlerId: bowler,
        runs: 0,
        isWide: false,
        isNoBall: false,
        isBye: false,
        isLegBye: false,
        isWicket: true,
        wicketType: 'bowled',
      });
    }

    if (isOverComplete || currentInnings?.totalWickets >= 10) {
      if (match.currentInnings === 0) {
        // Start second innings
      } else {
        navigation.navigate('Scorecard', { matchId: match.id });
      }
    }
  };

  const handleUndo = () => {
    const removed = undoLastBall();
    if (!removed) {
      Alert.alert('Info', 'No balls to undo');
    }
  };

  const battingPlayers = battingTeam?.players || [];
  const bowlingPlayers = bowlingTeam?.players || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
        {/* Scoreboard Header */}
        <View style={[styles.scoreboard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.matchTitle, { color: colors.text }]}>
            {match.title}
          </Text>
          <Text style={[styles.format, { color: colors.textSecondary }]}>
            {match.format} · {match.venue}
          </Text>

          {battingTeam && (
            <ScoreCard
              teamName={battingTeam.name}
              shortName={battingTeam.shortName}
              runs={currentInnings?.totalRuns || 0}
              wickets={currentInnings?.totalWickets || 0}
              overs={legalBalls.length / 6 + (legalBalls.length % 6) / 10}
              isBatting
              style={{ marginTop: 12 }}
            />
          )}
          {bowlingTeam && (
            <ScoreCard
              teamName={bowlingTeam.name}
              shortName={bowlingTeam.shortName}
              runs={0}
              wickets={0}
              overs={0}
              style={{ marginTop: 8 }}
            />
          )}

          {/* Current Over Summary */}
          {currentOver && (
            <OverSummary balls={currentOver.balls} overNumber={currentOver.overNumber} />
          )}

          {/* Batsmen Stats */}
          <View style={styles.currentPlayers}>
            <View style={styles.batsmanRow}>
              <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
                Batting
              </Text>
              <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
                R(B) SR
              </Text>
            </View>
            {[striker, nonStriker].filter(Boolean).map((pid) => {
              const player = battingPlayers.find((p) => p.id === pid);
              const playerBalls = allBalls.filter((b) => b.batsmanId === pid);
              const runs = playerBalls.reduce((s, b) => s + b.runs, 0);
              const balls = playerBalls.filter(isLegalDelivery).length;
              const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
              return (
                <View key={pid} style={styles.batsmanRow}>
                  <Text style={[styles.playerName, { color: colors.text }]}>
                    {pid === striker ? '🏏 ' : ''}{player?.name || 'Unknown'}
                  </Text>
                  <Text style={[styles.playerStats, { color: colors.text }]}>
                    {runs}({balls}) {sr}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Bowler Stats */}
          {bowler && (
            <View style={styles.bowlerBox}>
              <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
                Bowling
              </Text>
              <Text style={[styles.playerName, { color: colors.text }]}>
                {bowlingPlayers.find((p) => p.id === bowler)?.name || 'Unknown'}
              </Text>
            </View>
          )}
        </View>

        {/* Player Selection */}
        <View style={styles.controls}>
          <PlayerSelect
            label="Select Striker"
            players={battingPlayers}
            selectedId={striker}
            onSelect={setStrikerLocal}
          />
          <PlayerSelect
            label="Select Non-Striker"
            players={battingPlayers}
            selectedId={nonStriker}
            onSelect={setNonStrikerLocal}
          />
          <PlayerSelect
            label="Select Bowler"
            players={bowlingPlayers}
            selectedId={bowler}
            onSelect={setBowlerLocal}
          />
        </View>

        {/* Over History */}
        {currentInnings && currentInnings.overs.length > 0 && (
          <View style={styles.overHistory}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Over History
            </Text>
            {currentInnings.overs.map((over) => (
              <OverSummary
                key={over.overNumber}
                balls={over.balls}
                overNumber={over.overNumber}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Ball Control Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <BallControl
          onBall={handleBall}
          onUndo={handleUndo}
          canUndo={allBalls.length > 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scoreboard: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  matchTitle: { fontSize: 18, fontWeight: '800' },
  format: { fontSize: 12, marginTop: 2 },
  currentPlayers: { marginTop: 16 },
  batsmanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  playerLabel: { fontSize: 12, fontWeight: '600' },
  playerName: { fontSize: 14, fontWeight: '600' },
  playerStats: { fontSize: 14, fontWeight: '700' },
  bowlerBox: { marginTop: 12 },
  controls: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  overHistory: { padding: 16 },
  bottomSheet: {
    borderTopWidth: 1,
    paddingBottom: 20,
  },
});
