import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';

export function ProfileScreen({ navigation }: any) {
  const colors = useColors();
  const { user, logout, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    updateProfile({ name });
    setSaving(false);
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    { label: 'Matches', value: '47' },
    { label: 'Runs', value: '1,284' },
    { label: 'Wickets', value: '89' },
    { label: 'Avg', value: '32.1' },
    { label: 'HS', value: '112*' },
    { label: 'SR', value: '138.2' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        <Avatar name={user?.name || 'U'} size={80} />
        {editing ? (
          <View style={styles.editForm}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
            <View style={styles.editActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setEditing(false);
                  setName(user?.name || '');
                }}
                variant="outline"
                size="small"
                style={{ flex: 1 }}
              />
              <Button
                title="Save"
                onPress={handleSave}
                loading={saving}
                size="small"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>
              {user?.email || ''}
            </Text>
            <Button
              title="Edit Profile"
              onPress={() => setEditing(true)}
              variant="outline"
              size="small"
              style={{ marginTop: 12 }}
            />
          </>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View
            key={stat.label}
            style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <Card title="Settings">
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: colors.text }]}>
            Notification Preferences
          </Text>
          <Text style={{ color: colors.textSecondary }}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: colors.text }]}>
            Appearance
          </Text>
          <Text style={{ color: colors.textSecondary }}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: colors.text }]}>
            Data & Sync
          </Text>
          <Text style={{ color: colors.textSecondary }}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: colors.text }]}>
            About
          </Text>
          <Text style={{ color: colors.textSecondary }}>›</Text>
        </TouchableOpacity>
      </Card>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={{ marginTop: 16 }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: '800', marginTop: 12 },
  email: { fontSize: 14, marginTop: 2 },
  editForm: { width: '100%', marginTop: 12 },
  editActions: { flexDirection: 'row', gap: 8 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  menuText: { fontSize: 14, fontWeight: '500' },
});
