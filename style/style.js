import { StyleSheet } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../style/Metrics.js';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(10),
    width: '100%'
  },
  header: {
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    height: verticalScale(55)
  },
  footer: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    height: verticalScale(40)
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: moderateScale(23),
    textAlign: 'center',
    margin: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: moderateScale(14),
    textAlign: 'center',
    margin: moderateScale(10),
    alignItems: 'center'
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    width: '100%',
    fontSize: 15,
    textAlign: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 22,
    marginTop: 2
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: 'skyblue',
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color:"#2B2B52",
    textAlign: 'center',
    fontSize: 19
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
  },
});