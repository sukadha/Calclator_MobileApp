import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Vibration,
  Dimensions
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_SIZE = screenWidth / 4 - 10;

type ButtonType = 'number' | 'operation' | 'function';
type Operation = '+' | '-' | '*' | '/' | '=' | 'C' | 'CE' | '±' | '%';

interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: Operation | null;
  waitingForOperand: boolean;
}

// Calculator Button Component
const CalculatorButton: React.FC<{
  label: string;
  onPress: () => void;
  type?: ButtonType;
}> = ({ label, onPress, type = 'number' }) => {
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    switch (type) {
      case 'number':
        return [baseStyle, styles.numberButton];
      case 'operation':
        return [baseStyle, styles.operationButton];
      case 'function':
        return [baseStyle, styles.functionButton];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'operation':
        return styles.operationText;
      case 'function':
        return styles.functionText;
      default:
        return styles.numberText;
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

// Main Calculator Component
export default function App() {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    waitingForOperand: false,
  });

  const inputDigit = (digit: string) => {
    if (state.waitingForOperand) {
      setState({
        ...state,
        currentValue: digit,
        waitingForOperand: false,
      });
    } else {
      const newValue = state.currentValue === '0' && digit !== '.'
        ? digit
        : state.currentValue + digit;
      
      setState({ ...state, currentValue: newValue });
    }
  };

  const inputDecimal = () => {
    if (state.waitingForOperand) {
      setState({
        ...state,
        currentValue: '0.',
        waitingForOperand: false,
      });
    } else if (state.currentValue.indexOf('.') === -1) {
      setState({
        ...state,
        currentValue: state.currentValue + '.',
      });
    }
  };

  const clearAll = () => {
    setState({
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForOperand: false,
    });
  };

  const clearEntry = () => {
    setState({ ...state, currentValue: '0' });
  };

  const toggleSign = () => {
    const value = parseFloat(state.currentValue);
    const newValue = (-value).toString();
    setState({ ...state, currentValue: newValue });
  };

  const percentage = () => {
    const value = parseFloat(state.currentValue);
    const newValue = (value / 100).toString();
    setState({ ...state, currentValue: newValue });
  };

  const performOperation = (operation: Operation) => {
    if (state.operation && !state.waitingForOperand) {
      calculate();
    }
    
    setState({
      ...state,
      previousValue: state.currentValue,
      operation: operation,
      waitingForOperand: true,
    });
  };

  const calculate = () => {
    if (!state.operation || state.waitingForOperand) return;

    const current = parseFloat(state.currentValue);
    const previous = parseFloat(state.previousValue);
    
    if (isNaN(current) || isNaN(previous)) return;

    let result: number;

    switch (state.operation) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        if (current === 0) {
          clearAll();
          setState(prev => ({ ...prev, currentValue: 'Error' }));
          return;
        }
        result = previous / current;
        break;
      default:
        return;
    }

    const formattedResult = formatNumber(result);
    
    setState({
      currentValue: formattedResult,
      previousValue: '',
      operation: null,
      waitingForOperand: true,
    });
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    const rounded = Math.round(num * 1000000) / 1000000;
    let result = rounded.toString();
    if (result.includes('.')) {
      result = result.replace(/\.?0+$/, '');
    }
    return result;
  };

  const handleOperation = (op: Operation) => {
    Vibration.vibrate(10);
    if (op === '=') {
      calculate();
    } else if (op === 'C') {
      clearAll();
    } else if (op === 'CE') {
      clearEntry();
    } else if (op === '±') {
      toggleSign();
    } else if (op === '%') {
      percentage();
    } else {
      performOperation(op);
    }
  };

  const getDisplayText = (): string => {
    if (state.currentValue === 'Error') return 'Error';
    if (state.currentValue.length > 12) {
      return parseFloat(state.currentValue).toExponential(8);
    }
    return state.currentValue;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{getDisplayText()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalculatorButton label="C" type="function" onPress={() => handleOperation('C')} />
          <CalculatorButton label="CE" type="function" onPress={() => handleOperation('CE')} />
          <CalculatorButton label="%" type="function" onPress={() => handleOperation('%')} />
          <CalculatorButton label="/" type="operation" onPress={() => handleOperation('/')} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="7" type="number" onPress={() => inputDigit('7')} />
          <CalculatorButton label="8" type="number" onPress={() => inputDigit('8')} />
          <CalculatorButton label="9" type="number" onPress={() => inputDigit('9')} />
          <CalculatorButton label="*" type="operation" onPress={() => handleOperation('*')} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="4" type="number" onPress={() => inputDigit('4')} />
          <CalculatorButton label="5" type="number" onPress={() => inputDigit('5')} />
          <CalculatorButton label="6" type="number" onPress={() => inputDigit('6')} />
          <CalculatorButton label="-" type="operation" onPress={() => handleOperation('-')} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="1" type="number" onPress={() => inputDigit('1')} />
          <CalculatorButton label="2" type="number" onPress={() => inputDigit('2')} />
          <CalculatorButton label="3" type="number" onPress={() => inputDigit('3')} />
          <CalculatorButton label="+" type="operation" onPress={() => handleOperation('+')} />
        </View>

        <View style={styles.row}>
          <CalculatorButton label="±" type="function" onPress={() => handleOperation('±')} />
          <CalculatorButton label="0" type="number" onPress={() => inputDigit('0')} />
          <CalculatorButton label="." type="number" onPress={inputDecimal} />
          <CalculatorButton label="=" type="operation" onPress={() => handleOperation('=')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  displayContainer: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  displayText: {
    fontSize: 64,
    color: '#ffffff',
    fontWeight: '300',
    textAlign: 'right',
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
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
  numberButton: {
    backgroundColor: '#333333',
  },
  operationButton: {
    backgroundColor: '#ff9f0a',
  },
  functionButton: {
    backgroundColor: '#a5a5a5',
  },
  numberText: {
    fontSize: 30,
    color: '#ffffff',
  },
  operationText: {
    fontSize: 35,
    color: '#ffffff',
    fontWeight: '600',
  },
  functionText: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '500',
  },
});