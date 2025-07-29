import React, {useState,useEffect} from 'react';
import { Animated, Easing, StyleSheet} from 'react-native';

type Props = {
  onToggle: () => void;
  isOn: boolean;
};

const Toggle = ({onToggle, isOn}: Props) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 17],
  });

  // return (
  //   <ToggleContainer onPress={onPress} color={isOn ? 'red' : 'grey'}>
  //     <ToggleWheel
  //       style={{
  //         transform: [{translateX}],
  //       }}
  //     />
  //   </ToggleContainer>
  // );
};

export default Toggle;

// const ToggleContainer = styled.TouchableOpacity<{color: string}>`
//   width: 36px;
//   height: 20px;
//   border-radius: 10px;
//   justify-content: center;
//   background-color: ${props => props.color};
// `;


const styles = StyleSheet.create({
  toggleWheel: {
    width: 18,
    height: 18,
    backgroundColor: 'white',
    borderRadius: 99,
  },
});
