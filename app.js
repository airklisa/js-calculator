const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operand]')
const singleOperationButtons = document.querySelectorAll('[data-single-operand]')
const equalsButton = document.querySelector('[data-equals]')
const percentButton = document.querySelector('[data-percent]')
const deleteButton = document.querySelector('[data-delete]')
const clearButton = document.querySelector('[data-clear]')
const musicButton = document.querySelector('[data-music]')
const changeButton = document.querySelector('[data-change]')
const beep = new Audio('beep.wav')
const previousTextElement = document.querySelector('[data-prev]')
const currentTextElement = document.querySelector('[data-cur]')


class Calculator{
    constructor(previousTextElement,currentTextElement){
        this.previousTextElement = previousTextElement
        this.currentTextElement = currentTextElement
        this.clear()
        this.resetCalc = false
        this.musicFlag = false
    }

    clear(){
        this.currentText = ''
        this.previousText = ''
        this.operation = undefined
    }

    delete(){
        this.currentText = this.currentText.toString().slice(0,-1)
    }

    appendNumber(number){
        if(number === '.' && this.currentText.includes('.')) return
        
        if(this.resetCalc === true){
            this.currentText = ''
            this.resetCalc = false
        }
        
        this.currentText = this.currentText.toString() + number.toString()
        if(this.musicFlag === true) beep.play()
    }

    changeSign(){
        if(this.currentText.includes('-')){
            this.currentText = this.currentText.slice(1)
        }
        else{
            this.currentText = '-'+ this.currentText
        }

    }
    
    calculatePercentage(){
        let final
        const prev = this.previousText
        const curr = this.currentText

        if(isNaN(prev) || isNaN(curr)) return

        final = curr / 100 * prev

        this.currentText = final
        
        if(this.previousText === ''){
            this.resetCalc = true
        }
        
        this.singleOperationFlag = true

    }

    singleOperation(operationSingle){
        let final
        const curr = this.currentText
        
        if(isNaN(curr)) return
        
        this.operationSingle = operationSingle
        
        switch(this.operationSingle){
            case 'x²':
                final = curr * curr
                break
            case '√x':
                final = Math.sqrt(curr)
                break
        }
        
        if(this.previousText === ''){
            this.resetCalc = true
        }

        this.currentText = final
        this.singleOperationFlag = true

    }

    choseOperation(operation){
        if(this.currentText === '') return
        
        if(this.previousText != ''){
            this.computeElements()
        }
        
        this.operation = operation
        this.previousText = this.currentText
        this.currentText = ''

    }

    computeElements(){
        let final
        const prev = parseFloat(this.previousText)
        const curr = parseFloat(this.currentText)
        
        if(isNaN(prev) || isNaN(curr)) return
        
        switch(this.operation){
            case '+':
                final = prev + curr
                break
            case '-':
                final = prev - curr
                break
            case 'X':
                final = prev * curr
                break
            case '÷':
                final = prev / curr
                break
            default:
                return
        }
        
        this.currentText = final
        this.operation = undefined
        this.previousText = ''

    }

    getDisplayNumber(number){
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        
        if(isNaN(integerDigits)){
            integerDisplay = ''
        }
        else{
            integerDisplay = integerDigits.toLocaleString('en',{
                maximumFractionDigits: 0
            })
        }
        
        if(decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`
        }
        else{
            return integerDisplay
        }
    }

    updateScreen(){
        this.currentTextElement.innerText = this.getDisplayNumber(this.currentText)
        
        if(this.singleOperationFlag === true){
            this.singleOperationFlag = false
            return
        }
        
        if(this.operation != null){
            this.previousTextElement.innerText = `${this.getDisplayNumber(this.previousText)} ${this.operation}`
        }
        else{ 
            this.previousTextElement.innerText = ''
        }
    }

    music(){
        console.log(this.musicFlag)
        if(this.musicFlag == true){
            musicButton.setAttribute("class","dev")
            this.musicFlag = false
            return
        }

        musicButton.setAttribute("class","clicked");
        this.musicFlag = true
        console.log(this.musicFlag)
    }
}

const calc = new Calculator(previousTextElement,currentTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calc.appendNumber(button.innerText)
        calc.updateScreen()
        if(calc.musicFlag === true) beep.play()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calc.choseOperation(button.innerText)
        calc.updateScreen()
        if(calc.musicFlag === true) beep.play()
    })
})

singleOperationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calc.singleOperation(button.innerText)
        calc.updateScreen()
        if(calc.musicFlag === true) beep.play()
    })
})

equalsButton.addEventListener('click', button => {
    calc.computeElements()
    calc.updateScreen()
    calc.resetCalc = true
    if(calc.musicFlag === true) beep.play()
})

clearButton.addEventListener('click', button => {
    calc.clear()
    calc.updateScreen()
    if(calc.musicFlag === true) beep.play()
})

deleteButton.addEventListener('click', button => {
    calc.delete()
    calc.updateScreen()
    if(calc.musicFlag === true) beep.play()
})

changeButton.addEventListener('click', button => {
    calc.changeSign()
    calc.updateScreen()
    if(calc.musicFlag === true) beep.play()
})

percentButton.addEventListener('click', button => {
    calc.calculatePercentage()
    calc.updateScreen()
    if(calc.musicFlag === true) beep.play()
})

musicButton.addEventListener('click', button => {
    calc.music()
    if(calc.musicFlag === true) beep.play()
})
