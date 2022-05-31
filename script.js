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

buttons.forEach((button) => {
    button.addEventListener('click', processInput);
});
document.addEventListener('keypress', processInput);
//backspace doesn't register on 'keypress'
document.addEventListener('keydown', (e) => {
    if (e.key == 'Backspace') processInput(e);
});

function processInput(e) {
    displayedNum = inputObj[inputObj.currentOperand];
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
            case 'Enter':
                console.log('pressed enter')
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
    if (inputObj.calculated) {
        displayedNum = '0.';
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
    if (inputObj.currentOperand === 'operandX') return;
    let result;
    //'y' lets user press enter without redundant operandY when both are same
    if (displayedNum === 'y' && inputObj.operator) {
        result = operate(inputObj.operator, inputObj.operandX, inputObj.operandX);
    } else {
        result = operate(inputObj.operator, inputObj.operandX, inputObj.operandY);
        inputObj.reset();
    }
    //"calculated: true" stops new input from concatenating to previous result
    inputObj.calculated = true;
    inputObj.operandX = result;
    display.textContent = result;
    toggleOperator();
};

function enterOperator(input) {
    if (inputObj.operator) calculate();
    inputObj.currentOperand = 'operandY';
    displayedNum = inputObj[inputObj.currentOperand];
    inputObj.operator = input;
    inputObj.calculated = false;
    toggleOperator(input);
};

function removeLastDigit() {
    if (displayedNum === '0') return;
    else if (displayedNum.length === 1 || typeof +displayedNum !== 'number') {
        displayedNum = '0';
        if (inputObj.currentOperand = 'operandX') toggleClearButton('AC');
    }
    else displayedNum = displayedNum.slice(0, -1);
    display.textContent = displayedNum;
};

function percentify() {
    displayedNum = `${displayedNum / 100}`;
    display.textContent = displayedNum;
};

function toggleNegative() {
    displayedNum = `${displayedNum * -1}`;
    display.textContent = displayedNum;
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
    if (result.toString().length > 6) return 'TooBig';
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