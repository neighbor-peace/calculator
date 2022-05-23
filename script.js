let inputObj = {operandA: '0',};
const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
    button.addEventListener('click', processInput);
});

document.addEventListener('keypress', processInput);

document.addEventListener('keydown', (e) => {
    if (e.key == 'Backspace') processInput(e)
});

function processInput(e) {
    let input = e.type == 'click' ? this.textContent : `${e.key}`;
    if (!isNaN(input)) {
        enterNumber(input);
    } else if (input === '.') {
        enterFloatingPoint();
    } else if (input === 'AC' || input === 'Delete' || input === 'Backspace') {
        enterAC();
    } else if (input === '=' || input === 'Enter') {
        calculate();
    } else {
        switch(input) {
            case '+':
            case '-':
            case 'x':
            case '*':
            case '/':
            case '÷': 
                enterOperator(input);
                break;
            default: 
                console.log(input + ' key ignored')
                return;
        };
    };
};

function enterNumber(input) {
    if (!inputObj.operator) {
        //inputObj.calculated stops new input from concatenating to previous result
        if (inputObj.operandA === '0' || inputObj.calculated) {
            inputObj.operandA = input;
            inputObj.calculated = false;
        } else {
            inputObj.operandA += input;
        };
        display.textContent = inputObj.operandA;
    } else if (inputObj.operator) {
        if (!inputObj.operandB || inputObj.operandB === '0') {
            inputObj.operandB = input;
        } else {
            inputObj.operandB += input;
        };
        display.textContent = inputObj.operandB;
    };
};

function enterFloatingPoint() {
    if (inputObj.calculated) {
        inputObj.operandA = '0.';
        display.textContent = inputObj.operandA;
    } else if (!inputObj.operator && checkNoDecimals(inputObj.operandA)) {
        inputObj.operandA += '.';
        display.textContent = inputObj.operandA;
    } else if (inputObj.operator && !inputObj.operandB) {
        inputObj.operandB = '0.';
        display.textContent = inputObj.operandB;
    } else if (inputObj.operandB && checkNoDecimals(inputObj.operandB)) {
        inputObj.operandB += '.';
        display.textContent = inputObj.operandB;
    } else {
        return;
    };
};

function checkNoDecimals(operandInput) {
    return !operandInput.includes('.');
}

function enterAC() {
    inputObj = {operandA: '0',};
    display.textContent = '0';
};

function calculate() {
    if (!inputObj.operandA || !inputObj.operandB) {
        return;
    } else {
        let result = operate(inputObj.operator, inputObj.operandA, inputObj.operandB);
        inputObj = {
            operandA: result,
            //"calculated: true" stops new input from concatenating to previous result
            calculated: true, 
        };
        display.textContent = result;
    };
};

function enterOperator(input) {
    if (!inputObj.operandA) {
        return;
    } else if (!inputObj.operator) {
        inputObj.operator = input;
    } else if (!inputObj.operandB) {
        return;
    } else {
        let result = operate(inputObj.operator, inputObj.operandA, inputObj.operandB);
        inputObj = {
            operandA: result,
            operator: input,};
        display.textContent = result; 
    };
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
    if (Number.isInteger(result)) return result;
    return Math.round(result * 100) / 100;
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