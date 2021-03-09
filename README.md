Starting with the basic app

list any extra dependencies to install here:

npm install react-native-confetti-cannon
#### or
yarn add react-native-confetti-cannon


https://reactnativeexample.com/react-native-confetti-explosion-and-fall-like-ios-does/
how to use:
import ConfettiCannon from 'react-native-confetti-cannon';

const MyComponent = () => (
  <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
);
