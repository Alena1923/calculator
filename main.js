
//состояние калькулятора//
let calculatorState = "ok";
//переменная для храниния в памяти//
let memoryStoredValue = 0;
// первый операнд для вычислений//
let firstOperand = "";
//текщий оператор//
let currentOperator = "";
//состояние ожидания ввода операнда//
let operandExpected = false;
//cостояние оператор введен//
let operandInputed = false;

//получаем массив кннопок//
let buttons = Array.from(document.getElementsByTagName("button"));
//для каждой кнопки запускаем функцию выполняем функцию processButton//
buttons.forEach(btn => btn.addEventListener("click", e => processButton(e.target.dispatchEvent)));


//функция удаления лишних нулей//

function cleanNumberStr(numStr) {
    if (numStr == '0' || numStr == '-0' || numStr == '0.') {
        return '0';
    }
    //возвращаем преобразованную строку//
    return numStr;
}
//поверка, что нажата кнопка числа
function isNumber(Value) {
    return Value.lenghth == 1 && "0" <= Value && Value <= "9"

}

//главноая функция//

function processButton(Value) {
//проверяем состояние калькулятора, если оно в ошибке
    if (calculatorState == "err") {
        //если введено число
        if (isNumber(Value)) {
            clear();
        }
        else if (Value != "ca") {
            //для всех кнопок кроме ca ничего не делаем
            return;
        }
    }
    //получаем элемент поле ввода- ввода
    let box = document.getElementById('box');
    let boxValue = box.innerText;
//если введено число либо часть будующего числа
    if (isNumber(Value)) {
        //убираем ноль, если он введен перед цифрой//
        if (boxValue == '0' || boxValue == '-0') {
            boxValue = boxValue.slice(0, -1);
        }
        //случаи когда операнд ожидается истина
        // если число уже вводится условие не сработает
        // 1. когда была введена операция и нужно второе число
        // 2. когда нажали ровно
        // 3. ввод первого операнда для операции- в начало работы- операнд 0 
        if (operandExpected) {
            //если операнд начинает вводится-меняем состояния
            // бокс очищаем, т.к ожидаем новый ввод
            boxValue = '';
            operandExpected = false;
            //пользователь начал вводить операнд состояние поменялось
            operandInputed = true;
        }

        //в бокс записываем цифру
        boxValue += Value;
    }
// если в бокс введена операция
    if (['+', '-', '*', '/'].includes(Value)) {
        //если есть два операнда//
        if (firstOperand != '' && operandInputed) {
            //в операнд записываем второй операнд//
            const operand = cleanNumberStr(boxValue);
            //в бокс заисываем результат вычисления и запоминаем состояние
            [boxValue, calculatorState] = calculate(firstOperand, operand, currentOperator);
            //меняем состояние//
            operandInputed = false;
        }
        //записываем значеие из бокса в первый операнд
        firstOperand = cleanNumberStr(boxValue);
        //ожидаем ввод нового операнда - т.к операция
        operandExpected = true;
        //запоминаем текущую операцию
        currentOperator = Value
    }
    //переменная для вычислений//
    let operand = '';

    //основной выбор действий//
    switch (Value) {
        case '=':
            //проверка есть ли все данные//
            if (operandExpected || firstOperand == '' || currentOperator == "") {
                return
            }
            //создаем операнд для полседнего введенного значения//
            let operand = cleanNumberStr(boxValue);
            //вычисляем
            [boxValue, calculatorState] = calculate(firstOperand, secondOperand, currentOperator);
            //меняем состояние//
            operandInputed = false;
            operandExpected = true;
            //обнуляем операнд//
            firstOperand = '';
            currentOperator = '';
            break;

        case '.':
            //проверка есть ли уже точка в боксе
            if (boxValue.indexOf('.') >= 0) {
                return;
            }
            //добавляем точку
            boxValue += '.';
            break;

        case 'changeSign':
            if (boxValue.startsWith('-')) {
                boxValue = boxValue.slice(1);
            }
            else {
                boxValue = '-' + boxValue;
                break;
            }
        case 'sqrt':
            //корень из числа
            operand = cleanNumberStr(boxValue);
            //если минус шибка
            if (operand.startsWith('-')) {
                calculatorState = 'err';
            }
            else {
                //используем библиотеку мат для вычисления
                boxValue = Math.sqrt(parseFloat(operand)).toString();
            }
            break;
        case 'idivx':
            //делим на число
            operand = cleanNumberStr(boxValue);
            if (operand == '0') {
                calculatorState = 'err';
            }
            else {
                boxValue = (1.0 / parseFloat(operand)).toString();
            }
            break;
        case 'pow':
            //квадрат
            operand = cleanNumberStr(boxValue);
            boxValue = Math.pow(parseFloat(operand), 2);
            break;

        case '%':
            operand = cleanNumberStr(boxValue);
            boxValue = (parseFloat(operand) / 100.0).toString();
            break;
        case 'mr':
            //ставим в бокс значение из памяти
            boxValue = memoryStoredValue.toString();
            //если операнд ожидался говорим что введен
            if (operandExpected) {
                operandInputed = true;
                operandExpected = false;
            }
            break;
        case 'm+':
            //плюсуем к памяти
            operand = parseFloat(cleanNumberStr(boxValue));
            memoryStoredValue += operand;
            break;
        case 'm-':
            operand = parseFloat(cleanNumberStr(boxValue));
            memoryStoredValue -= operand;
            break;
        case 'mc':
            //обнуляем память
           memoryStoredValue=0;
           break;
           case 'remove':
            //удаляем последни елемент числа. на операцию не влияет//
            let removed = boxValue.slice(0, -1);
            //еслив боксе осталось число, то его отображаем, если нет, то в боксе записываем ноль//
            boxValue= removed.length> 0? removed : '0';
            break;

        case 'ce':
            //очищает поле ввода
            boxValue= '0';
            break;
            case 'ca':
                //очищает все кроме регистра памяти
                clear();
                return;
    }
    //проверка на состояние ошибки//
    if(calculatorState== 'err'){
        boxValue= 'Error';
    }
    //    выводим в бокс//
    box.innerText=boxValue;
}

//функция для арифметичеких операций//
//функция будет возвращать результат и состояние - есть ошибка или нет
function calculate(firstOperand, secondOperand, oparator) {
    //преобразуем строки в число
    const num1 = parseFloat(firstOperand);
    const num2 = parseFloat(secondOperandStr);
    //переменная для результата
    let total = 0;
//в зависимости от операции
    switch (oparator) {
        case '+':
            total = num1 + num2;
            break;
        case '-':
            total = num1 - num2;
            break;
        case '*':
            total = num1 * num2;
            break;
        case '/':
            //делить на ноль нельзя выдаем ошибку
            if (num2 = 0) {
                return [' ', 'err']
            }
            total = num1 / num2;
            break;
    }
    //во всех случаях кроме деления на ноль выдаем результат и состояние ок
    return [total.toString(), 'ok']
}

//функция очистки поля ввода//
function clear() {
    //состояник ок//
    calculatorState = 'ok';
    //очищаем значение операторов//
    firstOperand = '';
    currentOperator = '';
    //в боксе будет ноль//
    document.getElementById('box').innerText = '0';
    //состояния ожидания оператров в значениях фолс
    operandInputed = false;
    operandExpected = false;
}



