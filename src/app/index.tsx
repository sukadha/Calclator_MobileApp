import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Vibration
} from 'react-native';
import { CalculatorLogic, Operation } from '../utils/calculatorLogic';
import { CalculatorButton } from '../components/CalculatorButton';

export default function CalculatorApp() {
  const [calculator] = useState(() => new CalculatorLogic());
  const [displayValue, setDisplayValue] = useState('0');
  const [, forceUpdate] = useState({});

  const updateDisplay = () => {
    const state = calculator.getState();
    setDisplayValue(state.currentValue);
    forceUpdate({});
  };

  const handleNumberPress = (num: string) => {
    Vibration.vibrate(10);
    calculator.inputDigit(num);
    updateDisplay();
  };

  const handleDecimalPress = () => {
    Vibration.vibrate(10);
    calculator.inputDecimal();
    updateDisplay();
  };

  const handleClearEntry = () => {
    Vibration.vibrate(10);
    calculator.clearEntry();
    updateDisplay();
  };

  const handleClearAll = () => {
    Vibration.vibrate(10);
    calculator.clearAll();
    updateDisplay();
  };

  const handleToggleSign = () => {
    Vibration.vibrate(10);
    calculator.toggleSign();
    updateDisplay();
  };

  const handlePercentage = () => {
    Vibration.vibrate(10);
    calculator.percentage();
    updateDisplay();
  };

  const handleOperation = (op: Operation) => {
    Vibration.vibrate(10);
    if (op === '=') {
      calculator.calculate();
    } else if (op === 'C') {
      handleClearAll();
      return;
    } else if (op === 'CE') {
      handleClearEntry();
      return;
    } else if (op === '±') {
      handleToggleSign();
      return;
    } else if (op === '%') {
      handlePercentage();
      return;
    } else {
      calculator.performOperation(op);
    }
    updateDisplay();
  };

  const getDisplayText = (): string => {
    if (displayValue === 'Error') return 'Error';
    if (displayValue.length > 12) {
      return parseFloat(displayValue).toExponential(8);
    }
    return displayValue;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e89898" />
      
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{getDisplayText()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <CalculatorButton
            label="C"
            type="function"
            onPress={() => handleOperation('C')}
          />
          <CalculatorButton
            label="CE"
            type="function"
            onPress={() => handleOperation('CE')}
          />
          <CalculatorButton
            label="%"
            type="function"
            onPress={() => handleOperation('%')}
          />
          <CalculatorButton
            label="/"
            type="operation"
            onPress={() => handleOperation('/')}
          />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <CalculatorButton
            label="7"
            type="number"
            onPress={() => handleNumberPress('7')}
          />
          <CalculatorButton
            label="8"
            type="number"
            onPress={() => handleNumberPress('8')}
          />
          <CalculatorButton
            label="9"
            type="number"
            onPress={() => handleNumberPress('9')}
          />
          <CalculatorButton
            label="*"
            type="operation"
            onPress={() => handleOperation('*')}
          />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <CalculatorButton
            label="4"
            type="number"
            onPress={() => handleNumberPress('4')}
          />
          <CalculatorButton
            label="5"
            type="number"
            onPress={() => handleNumberPress('5')}
          />
          <CalculatorButton
            label="6"
            type="number"
            onPress={() => handleNumberPress('6')}
          />
          <CalculatorButton
            label="-"
            type="operation"
            onPress={() => handleOperation('-')}
          />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <CalculatorButton
            label="1"
            type="number"
            onPress={() => handleNumberPress('1')}
          />
          <CalculatorButton
            label="2"
            type="number"
            onPress={() => handleNumberPress('2')}
          />
          <CalculatorButton
            label="3"
            type="number"
            onPress={() => handleNumberPress('3')}
          />
          <CalculatorButton
            label="+"
            type="operation"
            onPress={() => handleOperation('+')}
          />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <CalculatorButton
            label="±"
            type="function"
            onPress={() => handleOperation('±')}
          />
          <CalculatorButton
            label="0"
            type="number"
            onPress={() => handleNumberPress('0')}
          />
          <CalculatorButton
            label="."
            type="number"
            onPress={handleDecimalPress}
          />
          <CalculatorButton
            label="="
            type="operation"
            onPress={() => handleOperation('=')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ed8787',
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
});