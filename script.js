const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    button.addEventListener('click', handleInput);
});

let inputObj = {operandA: '0',};

function handleInput() {
    let input = this.textContent;
    if (!isNaN(input)) {
        enterNumber(input);
    } else if (input === '.') {
        enterFloatingPoint();
    } else if (input === 'AC') {
        AC();
    } else if (input === '=') {
        equals();
    } else {
        operator(input);
    };
};

function enterNumber(input) {
    if (!inputObj.operator) {
        //inputObj.calculated stops new input from concatenating to previous result
        if (inputObj.operandA == 0 || inputObj.calculated) {
            inputObj.operandA = input;
            inputObj.calculated = false;
        } else {
            inputObj.operandA += input;
        };
        display.textContent = inputObj.operandA;
    } else if (inputObj.operator) {
        if (!inputObj.operandB || inputObj.operandB == 0) {
            inputObj.operandB = input;
        } else {
            inputObj.operandB += input;
        };
        display.textContent = inputObj.operandB;
    };
};

function enterFloatingPoint() {
    if (!inputObj.operator && noDecimalChecker(inputObj.operandA)) {
        inputObj.operandA += '.';
        display.textContent = inputObj.operandA;
    } else if (inputObj.operator && !inputObj.operandB) {
        inputObj.operandB = '0.';
        display.textContent = inputObj.operandB;
    } else if (inputObj.operandB && noDecimalChecker(inputObj.operandB)) {
        inputObj.operandB += '.';
        display.textContent = inputObj.operandB;
    } else {
        return;
    };
};

function noDecimalChecker(operandInput) {
    return !operandInput.includes('.');
}

function AC() {
    inputObj = {operandA: '0',};
    display.textContent = '0';
};

function equals() {
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

function operator(input) {
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
            result = multiply(x, y);
            break;
        case '÷':
            result = divide(x, y);
    };
    if (result === Infinity) {
        return "Nice Try";
    } else {
        return Number.isInteger(result) ? result : result.toFixed(3);
    };
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