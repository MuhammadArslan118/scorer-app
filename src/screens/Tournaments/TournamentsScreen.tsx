import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useTeamStore } from '../../store/teamStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Tournament {
  id: string;
  name: string;
  format: 'knockout' | 'league' | 'group';
  teams: string[];
  matches: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: Date;
}

export function TournamentsScreen({ navigation }: any) {
  const colors = useColors();
  const { teams } = useTeamStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'tour1',
      name: 'Summer Championship 2025',
      format: 'league',
      teams: teams.slice(0, 4).map((t) => t.id),
      matches: [],
      status: 'ongoing',
      startDate: new Date(),
    },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentFormat, setTournamentFormat] = useState<'knockout' | 'league'>('league');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleCreate = () => {
    if (!tournamentName.trim()) {
      Alert.alert('Error', 'Please enter tournament name');
      return;
    }
    if (selectedTeams.length < 2) {
      Alert.alert('Error', 'Please select at least 2 teams');
      return;
    }
    const newTournament: Tournament = {
      id: 'tour_' + Date.now(),
      name: tournamentName,
      format: tournamentFormat,
      teams: selectedTeams,
      matches: [],
      status: 'upcoming',
      startDate: new Date(),
    };
    setTournaments([newTournament, ...tournaments]);
    setShowCreate(false);
    setTournamentName('');
    setSelectedTeams([]);
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tournaments</Text>
        <Button
          title="+ New"
          onPress={() => setShowCreate(true)}
          size="small"
        />
      </View>

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Tournament
            </Text>
            <Input
              label="Tournament Name"
              placeholder="e.g. Summer Cup"
              value={tournamentName}
              onChangeText={setTournamentName}
            />
            <Text style={[styles.label, { color: colors.text }]}>Format</Text>
            <View style={styles.formatRow}>
              <Button
                title="League"
                onPress={() => setTournamentFormat('league')}
                variant={tournamentFormat === 'league' ? 'primary' : 'outline'}
                size="small"
                style={{ flex: 1 }}
              />
              <Button
                title="Knockout"
                onPress={() => setTournamentFormat('knockout')}
                variant={tournamentFormat === 'knockout' ? 'primary' : 'outline'}
                size="small"
                style={{ flex: 1 }}
              />
            </View>
            <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>
              Select Teams
            </Text>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => toggleTeam(team.id)}
                style={[
                  styles.teamCheck,
                  { backgroundColor: selectedTeams.includes(team.id) ? colors.primaryLight : colors.surfaceVariant },
                ]}
              >
                <Text
                  style={{
                    color: selectedTeams.includes(team.id) ? colors.textOnPrimary : colors.text,
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  {team.name} ({team.shortName})
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowCreate(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button title="Create" onPress={handleCreate} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {tournaments.length === 0 ? (
        <Card>
          <Text style={[{ color: colors.textSecondary, textAlign: 'center' }]}>
            No tournaments yet. Create your first tournament!
          </Text>
        </Card>
      ) : (
        tournaments.map((tournament) => (
          <Card key={tournament.id}>
            <View style={styles.tournamentHeader}>
              <Text style={[styles.tournamentName, { color: colors.text }]}>
                {tournament.name}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      tournament.status === 'ongoing'
                        ? colors.success
                        : tournament.status === 'upcoming'
                        ? colors.warning
                        : colors.textSecondary,
                  },
                ]}
              >
                <Text style={styles.statusText}>{tournament.status}</Text>
              </View>
            </View>
            <Text style={[styles.formatText, { color: colors.textSecondary }]}>
              {tournament.format.toUpperCase()} · {tournament.teams.length} Teams
            </Text>
            <View style={styles.teamList}>
              {tournament.teams.map((teamId) => {
                const team = teams.find((t) => t.id === teamId);
                return (
                  <View key={teamId} style={[styles.teamTag, { backgroundColor: colors.surfaceVariant }]}>
                    <Text style={[styles.teamTagText, { color: colors.text }]}>
                      {team?.shortName || 'Unknown'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: { fontSize: 24, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  formatRow: { flexDirection: 'row', gap: 8 },
  teamCheck: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tournamentName: { fontSize: 16, fontWeight: '700', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  formatText: { fontSize: 12, marginTop: 4 },
  teamList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  teamTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamTagText: { fontSize: 12, fontWeight: '600' },
});
