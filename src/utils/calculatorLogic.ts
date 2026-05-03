export type Operation = '+' | '-' | '*' | '/' | '=' | 'C' | 'CE' | '±' | '%';

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: Operation | null;
  waitingForOperand: boolean;
}

export class CalculatorLogic {
  private state: CalculatorState;

  constructor() {
    this.state = {
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForOperand: false
    };
  }

  getState(): CalculatorState {
    return { ...this.state };
  }

  inputDigit(digit: string): void {
    if (this.state.waitingForOperand) {
      this.setState({
        currentValue: digit,
        waitingForOperand: false
      });
    } else {
      const newValue = this.state.currentValue === '0' && digit !== '.' 
        ? digit 
        : this.state.currentValue + digit;
      
      if (!this.isValidNumber(newValue)) return;
      
      this.setState({ currentValue: newValue });
    }
  }

  inputDecimal(): void {
    if (this.state.waitingForOperand) {
      this.setState({
        currentValue: '0.',
        waitingForOperand: false
      });
    } else if (this.state.currentValue.indexOf('.') === -1) {
      this.setState({
        currentValue: this.state.currentValue + '.'
      });
    }
  }

  clearEntry(): void {
    this.setState({ currentValue: '0' });
  }

  clearAll(): void {
    this.setState({
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForOperand: false
    });
  }

  toggleSign(): void {
    const value = parseFloat(this.state.currentValue);
    const newValue = (-value).toString();
    this.setState({ currentValue: newValue });
  }

  percentage(): void {
    const value = parseFloat(this.state.currentValue);
    const newValue = (value / 100).toString();
    this.setState({ currentValue: newValue });
  }

  performOperation(operation: Operation): void {
    if (this.state.operation && !this.state.waitingForOperand) {
      this.calculate();
    }
    
    this.setState({
      previousValue: this.state.currentValue,
      operation: operation,
      waitingForOperand: true
    });
  }

  calculate(): void {
    if (!this.state.operation || this.state.waitingForOperand) return;

    const current = parseFloat(this.state.currentValue);
    const previous = parseFloat(this.state.previousValue);
    
    if (isNaN(current) || isNaN(previous)) return;

    let result: number;

    switch (this.state.operation) {
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
          this.clearAll();
          this.setState({ currentValue: 'Error' });
          return;
        }
        result = previous / current;
        break;
      default:
        return;
    }

    const formattedResult = this.formatNumber(result);
    
    this.setState({
      currentValue: formattedResult,
      previousValue: '',
      operation: null,
      waitingForOperand: true
    });
  }

  private formatNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    
    // Handle decimal precision
    const rounded = Math.round(num * 1000000) / 1000000;
    let result = rounded.toString();
    
    // Remove trailing zeros after decimal
    if (result.includes('.')) {
      result = result.replace(/\.?0+$/, '');
    }
    
    return result;
  }

  private isValidNumber(value: string): boolean {
    // Prevent multiple decimals
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return false;
    
    // Prevent extremely long numbers
    if (value.length > 15) return false;
    
    return true;
  }

  private setState(newState: Partial<CalculatorState>): void {
    this.state = { ...this.state, ...newState };
  }
}