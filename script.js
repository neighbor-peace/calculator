let inputObj = {
    operandX: '0',
    //'y' lets user press enter without redundant operandY when both are same
    operandY: 'y',
    calculated: false,
    currentOperand: 'operandX',
    reset() {
        inputObj.operandX = '0';
        inputObj.operandY = 'y';
        inputObj.calculated = false;
        inputObj.currentOperand = 'operandX';
        delete inputObj.operator;
    },
};

let displayedNum;

const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');
const operatorButtons = document.querySelectorAll('button.operator');
const clearButton = document.querySelector('#clear');
const equalsButton = document.querySelector('#equals');

buttons.forEach((button) => {
    button.addEventListener('click', processInput);
});
document.addEventListener('keypress', processInput);
//backspace doesn't register on 'keypress'
document.addEventListener('keydown', (e) => {
    if (e.key == 'Backspace') processInput(e);
});

function processInput(e) {
    equalsButton.focus();  //allows pressing enter
    let input = e.type == 'click' ? this.textContent : `${e.key}`;
    if (!isNaN(input)) enterNumber(input);
    else {
        switch(input) {
            case '.':
                enterFloatingPoint();
                break;
            case '=':
                calculate();
                break;
            case '+':
            case '-':
            case 'x':
            case '*':
            case '/':
            case '÷':
                enterOperator(input);
                break;
            case 'C':
            case 'AC':
            case 'Delete':
                clearDisplay();
                break;
            case 'Backspace':
            case '⌫':
                removeLastDigit();
                break;
            case '%':
                percentify();
                break;
            case '+/-':
                toggleNegative();
                break;
            default:
                console.log(input + ' ignored')
        };
    };
};

function toggleOperator(input) {
    operatorButtons.forEach((button) => button.classList.remove('toggled'));
    if(input) {
        switch(input) {
            case '+':
                document.querySelector('#add').classList.add('toggled');
                break;
            case '-':
                document.querySelector('#subtract').classList.add('toggled');
                break;
            case 'x':
            case '*':
                document.querySelector('#multiply').classList.add('toggled');
                break;
            case '/':
            case '÷':
                document.querySelector('#divide').classList.add('toggled');
        };
    };
};

function enterNumber(input) {
    if (inputObj[inputObj.currentOperand].length >= 22) return;
    //inputObj.calculated stops new input from concatenating to previous result
    //'y' lets user press enter without redundant operandY when both are same
    if (displayedNum === '0' || displayedNum === 'y' || inputObj.calculated) {
        displayedNum = input;
        inputObj.calculated = false;
        toggleClearButton('C');
    } else {
        displayedNum += input;
    };
    display.textContent = displayedNum;
};

function enterFloatingPoint() {
    //stops decimal from concatenating to a calculated result
    if (inputObj.calculated || inputObj[inputObj.currentOperand] == 'y') {
        inputObj[inputObj.currentOperand] = '0.';
        inputObj.calculated = false;
        display.textContent = displayedNum;
    } else if (checkNoDecimals(displayedNum)) {
        displayedNum += '.';
        display.textContent = displayedNum;
    };
    toggleClearButton('C');
};

function clearDisplay() {
    if (displayedNum === '0') {
        display.textContent = '0';
        inputObj.reset();
        toggleOperator();
    } else {
        displayedNum = '0';
        display.textContent = '0';
        toggleClearButton('AC')
    };
};

function toggleClearButton(choice) {
    clearButton.textContent = choice;
};

function checkNoDecimals(operandInput) {
    return !operandInput.includes('.');
};

function calculate() {
    if (inputObj.currentOperand === 'operandX' && !inputObj.operator) return;
    let result;
    //'y' lets user press enter without redundant operandY when both are same
    if (displayedNum === 'y' && inputObj.operator) {
        result = operate(inputObj.operator, inputObj.operandX, inputObj.operandX);
    } else {
        result = operate(inputObj.operator, inputObj.operandX, inputObj.operandY);
    }
    //"calculated: true" stops new input from concatenating to previous result
    inputObj.calculated = true;
    inputObj.operandX = result;
    display.textContent = result;
    inputObj.currentOperand = 'operandX';
    toggleOperator();
};

function enterOperator(input) {
    if (inputObj.calculated = true) inputObj.operandY = 'y';
    if (inputObj.operator && inputObj.currentOperand === 'operandY' && inputObj.operandY !== 'y') {
        calculate();
        inputObj.operandY = 'y';
    }
    inputObj.currentOperand = 'operandY';
    displayedNum = inputObj[inputObj.currentOperand];
    inputObj.operator = input;
    inputObj.calculated = false;
    toggleOperator(input);
};

function removeLastDigit() {
    if (inputObj[inputObj.currentOperand] === '0') return;
    else if (isNaN(+inputObj[inputObj.currentOperand]) || inputObj[inputObj.currentOperand].length === 1 || inputObj.calculated) {
        inputObj[inputObj.currentOperand] = '0';
        toggleClearButton('AC');
    }
    else inputObj[inputObj.currentOperand] = inputObj[inputObj.currentOperand].slice(0, -1);
    display.textContent = inputObj[inputObj.currentOperand];
};

function percentify() {
    displayedNum = `${displayedNum / 100}`;
    display.textContent = displayedNum;
};

function toggleNegative() {
    if (inputObj[inputObj.currentOperand] == 'y') return;
    inputObj[inputObj.currentOperand] = `${inputObj[inputObj.currentOperand] * -1}`;
    display.textContent = inputObj[inputObj.currentOperand];
};

function operate(operator, x, y) {
    let result;
    switch(operator) {
        case '+':
            result = add(x, y);
            break;
        case '-':
            result = subtract(x, y);
            break;
        case 'x':
        case '*':
            result = multiply(x, y);
            break;
        case '÷':
        case '/':
            result = divide(x, y);
    };
    result = Math.round(result * 100) / 100;
    if (result === Infinity) return "...nah";
    return `${result}`;
};


function add(x, y) {
    return parseFloat(x) + parseFloat(y);
};
function subtract(x, y) {
    return x - y;
};
function multiply(x, y) {
    return x * y;
};
function divide(x, y) {
    return x / y;
};