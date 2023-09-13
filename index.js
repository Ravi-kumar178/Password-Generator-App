const inputSlider = document.querySelector(".slider");
const passwordLengthDisplay = document.querySelector(".password-length-display");

let password = " ";
let passwordLength = 10;
let checkCount = 0;

function handleSlider(){
    inputSlider.value = passwordLength;
    passwordLengthDisplay.innerText = passwordLength;

    /*fix the size of the slider background image  */
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}
handleSlider();

inputSlider.addEventListener("input",function(event){
    passwordLength = event.target.value;
    handleSlider();
})

const indicator = document.querySelector(".indicator");

function setIndicator(color){
    indicator.style.background = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
setIndicator("#ccc");

const uppercaseCheck = document.querySelector(".uppercase");
const lowercaseCheck = document.querySelector(".lowercase");
const number = document.querySelector(".numbers");
const symbol = document.querySelector(".symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked)hasUpper = true;
    if(lowercaseCheck.checked)hasLower = true;
    if(number.checked)hasNum = true;
    if(symbol.checked)hasSym = true;

    /*Setting Strength*/
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength > 8){
        setIndicator("#0f0");
    }
  else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >=6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,122));
}

function generateRandomSymbol(){
    let randomIndex = getRandomInteger(0,symbols.length-1);
    return symbols.charAt(randomIndex);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
    
})

/*Fisher-yates method */
function shufflePassword(array){

    for(let i = array.length-1 ; i>0 ; i-- ){
        const j = Math.floor(Math.random()*(i+1));
        /*Shuffle i and j */
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = " ";
    array.forEach((el) =>(str = str + el));
        
 
    return str;
}

let generateButton = document.querySelector(".generate-button");
let passwordDisplay = document.querySelector(".password-display");

generateButton.addEventListener("click",function(){
  
    console.log("zero check count");

    if(checkCount == 0) return;
    console.log("zero check count finished -> print nhi hoga...because loop gets back from [return]");

    /*zero check count finished -> print nhi hoga...because loop gets back from [return] */

    console.log("second condition")

    if(passwordLength <= checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("2nd condition finished");

    /* Let's go for make a password */
    password = " ";
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(number.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbol.checked){
        funcArr.push(generateRandomSymbol);
    }

    console.log("Got the element which is checked");

    /*Compulsory addition */
    for(let i = 0; i < funcArr.length ; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition");

    /*Remaining addition */
    for(let i=0; i < passwordLength - funcArr.length ; i++){
        let randomIndex = getRandomInteger(0,funcArr.length-1);
        password += funcArr[randomIndex]();
    }

    console.log("Remaining addition");
 
   let array = Array.from(password);
    password = shufflePassword(array);
    console.log("shuffling done");

    passwordDisplay.value = password;
    console.log("UI addition done");

    calculateStrength();
    console.log("indicator showing strength");

})

let copyMessage = document.querySelector(".copy-message");
let copyButton = document.querySelector(".copy");


async function copyContent(){

    try{
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "copied";
    }
    catch(e){
        copyMessage.innerText = "Failed"
    }

    /*To make copy wala span visible */
    copyMessage.classList.add("active");

    setTimeout(function(){
        copyMessage.classList.remove("active");
    },2000);

}

copyButton.addEventListener("click",function(){
    if(passwordDisplay.value){
        copyContent();
    }
})

 