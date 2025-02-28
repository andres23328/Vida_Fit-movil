import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';

export default function ProgressScreen() {
  const progress = {
    attendance: 15,
    totalClasses: 20,
    achievements: [
      'Completed 10 HIIT classes',
      'Perfect attendance - 1 week',
      'Weight goal achieved',
    ],
    stats: {
      weight: '75kg',
      bodyFat: '18%',
      muscleMass: '35kg',
    },
  };

  const attendanceProgress = progress.attendance / progress.totalClasses;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Progress</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Attendance</Text>
          <ProgressBar progress={attendanceProgress} style={styles.progressBar} />
          <Text style={styles.progressText}>
            {progress.attendance} of {progress.totalClasses} classes attended
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Achievements</Text>
          {progress.achievements.map((achievement, index) => (
            <Text key={index} style={styles.achievement}>• {achievement}</Text>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.stat}>Weight: {progress.stats.weight}</Text>
          <Text style={styles.stat}>Body Fat: {progress.stats.bodyFat}</Text>
          <Text style={styles.stat}>Muscle Mass: {progress.stats.muscleMass}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    marginBottom: 16,
  },
  progressBar: {
    marginVertical: 10,
    height: 10,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  achievement: {
    marginVertical: 5,
  },
  stat: {
    marginVertical: 5,
    fontSize: 16,
  },
});