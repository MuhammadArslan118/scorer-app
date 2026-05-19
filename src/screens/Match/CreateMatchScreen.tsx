import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useMatchStore } from '../../store/matchStore';
import { useTeamStore } from '../../store/teamStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { SIZES } from '../../constants/theme';

const FORMATS = ['T10', 'T20', 'ODI'] as const;

export function CreateMatchScreen({ navigation }: any) {
  const colors = useColors();
  const { createMatch } = useMatchStore();
  const { teams } = useTeamStore();

  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<'T10' | 'T20' | 'ODI'>('T20');
  const [venue, setVenue] = useState('');
  const [team1Id, setTeam1Id] = useState(teams[0]?.id || '');
  const [team2Id, setTeam2Id] = useState(teams[1]?.id || '');

  const oversMap: Record<string, number> = { T10: 10, T20: 20, ODI: 50 };

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a match title');
      return;
    }
    if (!team1Id || !team2Id) {
      Alert.alert('Error', 'Please select both teams');
      return;
    }
    if (team1Id === team2Id) {
      Alert.alert('Error', 'Teams must be different');
      return;
    }

    const t1 = teams.find((t) => t.id === team1Id);
    const t2 = teams.find((t) => t.id === team2Id);
    if (!t1 || !t2) return;

    const matchId = createMatch({
      title,
      format,
      overs: oversMap[format],
      venue,
      teams: [t1, t2],
    });

    navigation.replace('LiveScoring', { matchId });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Create New Match
      </Text>

      <Card>
        <Input
          label="Match Title"
          placeholder="e.g. Champions Trophy Final"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Venue"
          placeholder="e.g. Wankhede Stadium"
          value={venue}
          onChangeText={setVenue}
        />

        <Text style={[styles.label, { color: colors.text }]}>Format</Text>
        <View style={styles.formatRow}>
          {FORMATS.map((f) => (
            <Button
              key={f}
              title={f}
              onPress={() => setFormat(f)}
              variant={format === f ? 'primary' : 'outline'}
              size="small"
              style={{ flex: 1 }}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          Select Teams
        </Text>
        <View style={styles.teamRow}>
          {teams.slice(0, 4).map((team) => {
            const isSelected = team1Id === team.id || team2Id === team.id;
            const role = team1Id === team.id ? 'Team 1' : team2Id === team.id ? 'Team 2' : null;
            return (
              <Button
                key={team.id}
                title={`${team.shortName}${role ? ` (${role})` : ''}`}
                onPress={() => {
                  if (team1Id === team.id) setTeam1Id('');
                  else if (team2Id === team.id) setTeam2Id('');
                  else if (!team1Id) setTeam1Id(team.id);
                  else if (!team2Id) setTeam2Id(team.id);
                }}
                variant={isSelected ? 'primary' : 'outline'}
                size="small"
                style={{ marginBottom: 8 }}
              />
            );
          })}
        </View>

        <Button
          title="Create Match & Start Scoring"
          onPress={handleCreate}
          size="large"
          style={{ width: '100%', marginTop: 16 }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  formatRow: { flexDirection: 'row', gap: 8 },
  teamRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
