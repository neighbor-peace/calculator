let inputObj = {
    operandX: '0',
    operandY: '0',
    calculated: false,
    currentOperand: 'operandX',
    reset() {
        inputObj.operandX = '0';
        inputObj.operandY = '0';
        inputObj.calculated = false;
        inputObj.currentOperand = 'operandX';
        delete inputObj.operator;
    },
};

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
    let input = e.type == 'click' ? this.textContent : `${e.key}`;
    if (!isNaN(input)) {
        enterNumber(input);
    } else {
        switch(input) {
            case '.':
                enterFloatingPoint();
                break;
            case 'C':
            case 'AC':
            case 'Delete':
                clearDisplay();
                break;
            case '=':
            case 'Enter':
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
            case 'Backspace':
                removeLastDigit();
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
    if (inputObj[inputObj.currentOperand] === '0' || inputObj.calculated) {
        inputObj[inputObj.currentOperand] = input;
        inputObj.calculated = false;
        toggleClearButton('C');
    } else {
        inputObj[inputObj.currentOperand] += input;
    };
    display.textContent = inputObj[inputObj.currentOperand];
};

function enterFloatingPoint() {
    //stops decimal from concatenating to a calculated result
    if (inputObj.calculated) {
        inputObj[inputObj.currentOperand] = '0.';
        inputObj.calculated = false;
        display.textContent = inputObj[inputObj.currentOperand];
    } else if (checkNoDecimals(inputObj[inputObj.currentOperand])) {
        inputObj[inputObj.currentOperand] += '.';
        display.textContent = inputObj[inputObj.currentOperand];
    };
    toggleClearButton('C');
};

function clearDisplay() {
    if (inputObj[inputObj.currentOperand] === '0') {
        display.textContent = '0';
        inputObj.reset();
        toggleOperator();
    } else {
        inputObj[inputObj.currentOperand] = '0';
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
    let result = operate(inputObj.operator, inputObj.operandX, inputObj.operandY);
    inputObj.reset();
    //"calculated: true" stops new input from concatenating to previous result
    inputObj.calculated = true;
    inputObj.operandX = result;
    display.textContent = result;
    toggleOperator();
};

function enterOperator(input) {
    if (inputObj.operator) calculate();
    inputObj.currentOperand = 'operandY';
    inputObj.operator = input;
    inputObj.calculated = false;
    toggleOperator(input);
};

function removeLastDigit() {
    inputObj[inputObj.currentOperand] = inputObj[inputObj.currentOperand].slice(0, -1);
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
    if (result === Infinity) return "Nice Try";
    else if (Number.isInteger(result)) return `${result}`;
    else return `${Math.round(result * 100) / 100}`;
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