import React, { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import styles from '../style/style'; 
import { horizontalScale, moderateScale, verticalScale } from '../style/Metrics.js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header'; 
import Footer from './Footer'; 

const Scoreboard = () => {
  const [scores, setScores] = useState([
    { player: 'Player1', points: 150 },
    { player: 'Player2', points: 120 },
    { player: 'Player3', points: 90 },
  ]);

  const clearScoreboard = () => {
    setScores([]);
  };

  const renderScoreItem = ({ item }) => (
    <View style={styles.scoreItem}>
      <Text>{item.player}</Text>
      <Text>{item.points} points</Text>
    </View>
  );

  return (
    <>
      <Header /> 
      <View style={styles.container}>
      <MaterialCommunityIcons
          name="view-list"
          size={verticalScale(90)}
          color="steelblue"
        />
        <Text>Top Seven</Text>
        <FlatList
          data={scores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderScoreItem}
        />
        <Pressable style={styles.clearButton} onPress={clearScoreboard}>
          <Text  style={styles.clearButtonText}>CLEAR SCOREBOARD</Text>
        </Pressable>
      </View>
      <Footer /> 
    </>
  );
};

export default Scoreboard;

