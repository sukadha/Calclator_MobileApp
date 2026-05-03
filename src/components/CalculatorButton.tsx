import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_SIZE = screenWidth / 4 - 10;

export type ButtonType = 'number' | 'operation' | 'function';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  spanDouble?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onPress,
  type = 'number',
  spanDouble = false
}) => {
  // Direct inline styles for testing
  const getButtonStyle = (): ViewStyle => {
    if (spanDouble) {
      return {
        width: BUTTON_SIZE * 2 + 10,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#FF6B6B', // Force red
      };
    }
    
    switch (type) {
      case 'number':
        return {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          backgroundColor: '#FF6B6B', // Force RED for numbers
        };
      case 'operation':
        return {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          backgroundColor: '#4ECDC4', // Force TEAL for operations
        };
      case 'function':
        return {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          backgroundColor: '#ecdc8c', // Force YELLOW for functions
        };
      default:
        return {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (type) {
      case 'operation':
        return { fontSize: 35, color: '#b03382', fontWeight: '600' };
      case 'function':
        return { fontSize: 28, color: '#4ECDC4', fontWeight: '600' };
      default:
        return { fontSize: 30, color: '#cf5205', fontWeight: '500' };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={getTextStyle()}>{label}</Text>
    </TouchableOpacity>
  );
};

// Keep the styles object but it won't be used with inline styles
const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  doubleButton: {
    width: BUTTON_SIZE * 2 + 10,
    borderRadius: BUTTON_SIZE,
  },
  numberButton: {
    backgroundColor: '#FF6B6B',
  },
  operationButton: {
    backgroundColor: '#4ECDC4',
  },
  functionButton: {
    backgroundColor: '#ecdc8c',
  },
  numberText: {
    fontSize: 30,
    color: '#cf5205',
    fontWeight: '500',
  },
  operationText: {
    fontSize: 35,
    color: '#b03382',
    fontWeight: '600',
  },
  functionText: {
    fontSize: 28,
    color: '#4ECDC4',
    fontWeight: '600',
  },
});