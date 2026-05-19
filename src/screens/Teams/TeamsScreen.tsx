import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useTeamStore } from '../../store/teamStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Player } from '../../types';

const ROLES: Player['role'][] = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];

export function TeamsScreen({ navigation }: any) {
  const colors = useColors();
  const { teams, createTeam, addPlayer, removePlayer } = useTeamStore();
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamShort, setTeamShort] = useState('');

  const [addPlayerTeamId, setAddPlayerTeamId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<Player['role']>('batsman');

  const handleCreateTeam = () => {
    if (!teamName.trim() || !teamShort.trim()) {
      Alert.alert('Error', 'Please enter team name and short name');
      return;
    }
    createTeam({ name: teamName, shortName: teamShort.toUpperCase(), players: [] });
    setShowCreateTeam(false);
    setTeamName('');
    setTeamShort('');
  };

  const handleAddPlayer = () => {
    if (!playerName.trim() || !addPlayerTeamId) return;
    addPlayer(addPlayerTeamId, { name: playerName, role: playerRole, teamId: addPlayerTeamId });
    setPlayerName('');
    setAddPlayerTeamId(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Teams</Text>
        <Button
          title="+ New Team"
          onPress={() => setShowCreateTeam(true)}
          size="small"
        />
      </View>

      {/* Create Team Modal */}
      <Modal visible={showCreateTeam} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Team</Text>
            <Input
              label="Team Name"
              placeholder="e.g. Mumbai Strikers"
              value={teamName}
              onChangeText={setTeamName}
            />
            <Input
              label="Short Name"
              placeholder="e.g. MUM"
              value={teamShort}
              onChangeText={setTeamShort}
              maxLength={4}
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowCreateTeam(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Create"
                onPress={handleCreateTeam}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Player Modal */}
      <Modal visible={!!addPlayerTeamId} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Player</Text>
            <Input
              label="Player Name"
              placeholder="Enter player name"
              value={playerName}
              onChangeText={setPlayerName}
            />
            <Text style={[styles.label, { color: colors.text }]}>Role</Text>
            <View style={styles.roleRow}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setPlayerRole(role)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: playerRole === role ? colors.primary : colors.surfaceVariant,
                      borderColor: playerRole === role ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      { color: playerRole === role ? colors.textOnPrimary : colors.text },
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setAddPlayerTeamId(null)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Add"
                onPress={handleAddPlayer}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Teams List */}
      {teams.map((team) => (
        <Card key={team.id} title={team.name} subtitle={team.shortName}>
          {team.players.length > 0 ? (
            team.players.map((player) => (
              <View key={player.id} style={styles.playerRow}>
                <Avatar name={player.name} size={32} />
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, { color: colors.text }]}>
                    {player.name}
                  </Text>
                  <Text style={[styles.playerRole, { color: colors.textSecondary }]}>
                    {player.role}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('Remove Player', `Remove ${player.name}?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => removePlayer(team.id, player.id) },
                    ]);
                  }}
                >
                  <Text style={{ color: colors.error, fontSize: 12, fontWeight: '600' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No players yet. Add players to this team.
            </Text>
          )}
          <Button
            title="+ Add Player"
            onPress={() => setAddPlayerTeamId(team.id)}
            variant="outline"
            size="small"
            style={{ marginTop: 8 }}
          />
        </Card>
      ))}
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
    minHeight: 300,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  roleText: { fontSize: 12, fontWeight: '600' },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  playerInfo: { flex: 1, marginLeft: 10 },
  playerName: { fontSize: 14, fontWeight: '600' },
  playerRole: { fontSize: 12 },
  emptyText: { fontSize: 13, fontStyle: 'italic', paddingVertical: 8 },
});
