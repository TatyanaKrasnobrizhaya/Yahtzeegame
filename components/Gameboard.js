import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { 
  NBR_OF_DICES, 
  NBR_OF_THROWS, 
  MIN_SPOT, 
  MAX_SPOT, 
  BONUS_POINTS_LIMIT, 
  BONUS_POINTS
} from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import { horizontalScale, moderateScale, verticalScale } from '../style/Metrics.js';

export default function Gameboard({ navigation, route }) {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Throw dices');
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [upperSectionPoints, setUpperSectionPoints] = useState(0);


 // If dices are selected or not
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));

  // Dice spots
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));

  // If dice points are selected or not for the spots
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));

  // Total points for different spots
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

  // Icons for each dice spot
  const [diceIcons, setDiceIcons] = useState(new Array(NBR_OF_DICES).fill(''));

  //state to track selected bones
  const [savedDices, setSavedDices] = useState(new Array(NBR_OF_DICES).fill(false));


  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [playerName, route.params?.player]);

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
        <Text>{getSpotTotal(spot)}</Text>
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
      return 1;
    } else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
      setGameEndStatus(false);
      setDiceSpots(new Array(NBR_OF_DICES).fill(0));
      setDicePointsTotal(new Array(MAX_SPOT).fill(0));
      setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
      setSelectedDices(new Array(NBR_OF_DICES).fill(false));
      setSavedDices(new Array(NBR_OF_DICES).fill(false));
    }
  
    // Resets the selected points for each dice before a new roll
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
  
    const spots = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      // Generating a new value for each cube
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      
      if (!selectedDices[i] && !savedDices[i]) {
        spots.push(randomNumber);
      } else {
        spots.push(diceSpots[i]);
      }
    }
    setDiceIcons(spots.map(num => `dice-${num}`));
  
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again.');
  
    // Check for bonus points after each throw
    checkBonusPoints();
  
    // Updating the total number of points
    const newTotalPoints = spots.reduce((total, points) => total + points, 0);
    setTotalPoints(newTotalPoints);
  };


  const calculateTotalPoints = (selectedDicePoints, diceSpots) => {
    const totalPointsForSelectedDices = selectedDicePoints.reduce((total, isSelected, index) => {
      return isSelected ? total + diceSpots[index] : total;
    }, 0);
  
    return totalPointsForSelectedDices;
  };  


  const checkBonusPoints = () => {
    const requiredPointsForBonus = BONUS_POINTS_LIMIT;

    const upperPoints = dicePointsTotal.slice(0, 6).reduce((total, points) => total + points, 0);

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
    const newTotalPoints = diceSpots.reduce((total, points) => total + points, 0);
    setTotalPoints(newTotalPoints);
  };

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }


  const selectDice = (i) => {
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
      const dices = [...selectedDices];
      dices[i] = !selectedDices[i];
      setSelectedDices(dices);
  
      // Resetting saved bones when selecting new bones
      const saved = [...savedDices];
      saved[i] = false;
      setSavedDices(saved);
    } else {
      setStatus('You have to throw dices first.');
    }
  };


  function getDiceColor(i) {
    return selectedDices[i] ? 'black' : 'steelblue';
  }


  const selectDicePoints = (i) => {
    let selectedPoints = [...selectedDicePoints];
    let points = [...dicePointsTotal];
    selectedPoints[i] = true;
    let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
    points[i] = nbrOfDices * (i + 1);
    setSelectedDicePoints(selectedPoints);
    setDicePointsTotal(points);
    updateTotalPoints();
    return points[i];
  }

  function getDicePointsColor(i) {
    return (selectedDicePoints[i] && !gameEndStatus)
      ? 'black' : 'steelblue';
  }

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
      </View>
      <Footer />
    </>
  );
}