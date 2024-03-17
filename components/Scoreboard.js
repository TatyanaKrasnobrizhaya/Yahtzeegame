import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { format } from 'date-fns'; 
import { DataTable } from 'react-native-paper'; 
import styles from '../style/style'; 
import { verticalScale } from '../style/Metrics.js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header'; 
import Footer from './Footer'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const savedScores = await AsyncStorage.getItem('scores');
        console.log('Loaded scores from AsyncStorage:', savedScores);
        if (savedScores !== null) {
          setScores(JSON.parse(savedScores));
        }
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    };

    loadScores(); 
  }, []);

  const clearScoreboard = async () => {
    try {
      setScores([]);
      await AsyncStorage.removeItem('scores'); 
      console.log('Scoreboard cleared successfully.');
    } catch (error) {
      console.error('Error clearing scoreboard:', error);
    }
  };

  const renderScoreItem = ({ item }) => (
    <DataTable.Row>
      <DataTable.Cell>{item.player}</DataTable.Cell>
      <DataTable.Cell>{format(item.date, 'dd.MM.yyyy')}</DataTable.Cell> 
      <DataTable.Cell>{format(item.date, 'HH:mm')}</DataTable.Cell> 
      <DataTable.Cell numeric>{item.points}</DataTable.Cell>
    </DataTable.Row>
  );

 
  const sortedScores = [...scores].sort((a, b) => b.points - a.points);

  return (
    <>
      <Header /> 
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="view-list"
          size={verticalScale(90)}
          color="steelblue"
        />
        <Text style={styles.gameinfo}>Top Seven</Text>
        {sortedScores.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Player</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Time</DataTable.Title>
              <DataTable.Title numeric>Points</DataTable.Title>
            </DataTable.Header>
            {sortedScores.map((item, index) => (
              <DataTable.Row key={index.toString()}>
                <DataTable.Cell>{item.player}</DataTable.Cell>
                <DataTable.Cell>{format(item.date, 'dd.MM.yyyy')}</DataTable.Cell> 
                <DataTable.Cell>{format(item.date, 'HH:mm')}</DataTable.Cell> 
                <DataTable.Cell numeric>{item.points}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <Text style={styles.gameinfo}>No scores available</Text>
        )}
        <Pressable style={styles.clearButton} onPress={clearScoreboard}>
          <Text  style={styles.clearButtonText}>CLEAR SCOREBOARD</Text>
        </Pressable>
      </View>
      <Footer /> 
    </>
  );
};

export default Scoreboard;

