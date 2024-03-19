import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import Footer from './Footer';
import { 
  NBR_OF_DICES, 
  NBR_OF_THROWS, 
  MAX_SPOT, 
  BONUS_POINTS_LIMIT, 
  BONUS_POINTS
} from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

export default function Gameboard({ navigation, route }) {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Throw dices');
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
  const [diceIcons, setDiceIcons] = useState(new Array(NBR_OF_DICES).fill(''));
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [playerName, route.params?.player]);

  useEffect(() => {
    if (gameEndStatus) {
      saveTotalPointsToScoreboard(totalPoints, playerName);
    }
  }, [gameEndStatus, totalPoints, playerName]);  

  const saveTotalPointsToScoreboard = async () => {
    try {
      const totalPoints = calculateTotalPoints();
      let finalTotalPoints = totalPoints; // Переменная для хранения общего количества очков
  
      // Проверяем, достиг ли игрок минимального количества очков для получения бонуса
      if (totalPoints >= BONUS_POINTS_LIMIT) {
        finalTotalPoints += BONUS_POINTS; 
      }
  
      const newScore = { player: playerName, points: finalTotalPoints, date: new Date() }; 
      const storedScores = await AsyncStorage.getItem('scores'); 
      let scores = [];
      if (storedScores !== null) {
        scores = JSON.parse(storedScores);
      }
      scores.push(newScore); 
      await AsyncStorage.setItem('scores', JSON.stringify(scores)); 
      console.log('Data saved to AsyncStorage:', newScore); 
  
      // Возвращаем успешное сохранение данных
      return true;
    } catch (error) {
      // Обрабатываем ошибку сохранения данных
      console.error('Error saving totalPoints to scoreboard:', error); 
      return false;
    }
  };
  

  // Function to calculate the total points for the selected dices
  const calculateTotalPoints = () => {
    const totalPointsForSelectedDices = dicePointsTotal.reduce((total, points) => total + points, 0);
    return totalPointsForSelectedDices;
  };
  

  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={`dice-${dice}`}>
        <Pressable 
          key={`pressable-${dice}`}
          onPress={() => selectDice(dice)}>
          <MaterialCommunityIcons
            name={diceIcons[dice]}
            key={`icon-${dice}`}
            size={50} 
            color={getDiceColor(dice)}
          />
        </Pressable>
      </Col>
    );
  }

  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={`pointsRow-${spot}`}>
        <Text>{dicePointsTotal[spot]}</Text>
      </Col>
    );
  }

  const pointsToSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={`buttonsRow-${diceButton}`}>
        <Pressable 
          key={`pressable-${diceButton}`}
          onPress={() => selectDicePoints(diceButton)}>
          <MaterialCommunityIcons
            name={`numeric-${diceButton + 1}-circle`}
            key={`icon-${diceButton}`}
            size={35}
            color={getDicePointsColor(diceButton)}
          />
        </Pressable>
      </Col>
    );
  }

  const throwDices = () => {
    if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
      setStatus('Select your points before the next throw');
      setShowNewGameButton(true);
      return;
    } else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
      startNewGame();
      return;
    }
    
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
  
    const spots = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      
      if (!selectedDices[i]) {
        spots.push(randomNumber);
      } else {
        spots.push(diceSpots[i]);
      }
    }
    setDiceIcons(spots.map(num => `dice-${num}`));
  
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again.');
  
    checkBonusPoints();
  
    const newTotalPoints = spots.reduce((total, points) => total + points, 0);
    setTotalPoints(newTotalPoints);
  };
  

  const checkBonusPoints = () => {
    const requiredPointsForBonus = BONUS_POINTS_LIMIT;

    const upperPoints = dicePointsTotal.reduce((total, points) => total + points, 0);

    if (upperPoints >= requiredPointsForBonus) {
      const updatedTotalPoints = dicePointsTotal.map((points, index) => {
        if (!selectedDicePoints[index]) {
          return points + BONUS_POINTS;
        }
        return points;
      });

      setDicePointsTotal(updatedTotalPoints);
      setUpperSectionPoints(upperPoints);
    }
  };

  const updateTotalPoints = () => {
    const newTotalPoints = dicePointsTotal.reduce((total, points) => total + points, 0);
    setTotalPoints(newTotalPoints);
  };

  const selectDice = (i) => {
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
      const dices = [...selectedDices];
      dices[i] = !selectedDices[i];
      setSelectedDices(dices);
    } else {
      setStatus('You have to throw dices first.');
    }
  };

  function getDiceColor(i) {
    return selectedDices[i] ? 'black' : 'steelblue';
  }

  const selectDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
    let selected = [...selectedDices];
    let selectedPoints = [...selectedDicePoints];
    let points = [...dicePointsTotal];
    if(!selectedPoints[i]) {
      selectedPoints[i] = true;
      let nbrOfDices = diceSpots.reduce((total, x) => (x === (i +1) ? total + 1 : total), 0);
    points[i] = nbrOfDices * (i + 1);
    setSelectedDicePoints(selectedPoints);
    setDicePointsTotal(points);
    updateTotalPoints();
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    return points[i];
  }
  else {
    setStatus('You already selected points for' + (i + 1));
  }
}
  else{
    setStatus("Throw" + NBR_OF_THROWS + "times before setting points.")
  }
}

  function getDicePointsColor(i) {
    return (selectedDicePoints[i] && !gameEndStatus)
      ? 'black' : 'steelblue';
  }

  const startNewGame = () => {
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setStatus('Throw dices');
    setGameEndStatus(false);
    setTotalPoints(0);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setShowNewGameButton(false); 
  
    // Вызываем функцию сохранения данных при начале новой игры
    const saveSuccess = saveTotalPointsToScoreboard();
    if (saveSuccess) {
      console.log('Total points saved to scoreboard.'); 
    } else {
      console.log('Failed to save total points to scoreboard.'); 
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Container fluid>
          <Row>{dicesRow}</Row>
        </Container>
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text>{status}</Text>
        <Pressable style={styles.button} onPress={throwDices}>
          <Text style={styles.buttonText}>THROW DICES</Text>
        </Pressable>
        <Text style={styles.gameinfo}>Total: {calculateTotalPoints(selectedDicePoints, diceSpots)}</Text>
        <Text>You are {BONUS_POINTS_LIMIT - calculateTotalPoints(selectedDicePoints, diceSpots)} points away from bonus</Text>
        <Container fluid>
          <Row style={[styles.gameinfo, styles.row]}>{pointsRow}</Row>
        </Container>
        <Container fluid>
          <Row >{pointsToSelectRow}</Row>
        </Container>
        <Text style={[styles.gameinfo, styles.row]}>Player: {playerName}</Text>
        {showNewGameButton && (
          <Pressable style={styles.button} onPress={startNewGame}>
            <Text style={styles.buttonText}>New Game</Text>
          </Pressable>
        )}
      </View>
      <Footer />
    </>
  );
}
