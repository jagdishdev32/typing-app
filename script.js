const timeElement = document.getElementById('time')
const capslockElement = document.getElementById('capslock')
//const dataPara = document.getElementById("data-para");

// Getting datatype
const dataType = document.getElementById('dataType-options')
const dataTypeValue = dataType.value

// For random dataType choosing random datatype
let dataTypes = ["words", "paragraph", "lorem"]
let random = dataTypes[Math.floor(Math.random(4)*3)]
console.log(random)
let array = "words"

switch (dataTypeValue) {
  case "words":
    array = words
    break;
  case "paragraph":
    array = paragraph
    break;
  case "lorem":
    array = lorem
    break;
  case "random":
    array = window[random]
    break;
  default:
  array = words
  break;
}

// Suffling wordlist 
for(let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * i)
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}

//dataPara.innerText = array.join(' ')
const data = array.join(' ').trim().replace('<br>', ' ');

function createTable(table, data) {
  function createNode(ele, cls, text = null, id = null) {
    let element = document.createElement(ele);
    element.classList.add(cls);
    if (text) {
      element.innerText = text;
    }
    if (id) {
      element.id = id;
    }
    return element;
  }

  function createWord(word) {
    // Word Element
    let screenBasicWord = createNode("div", "screenBasic-word");
    let y = 0;
    // For letter in list create element and add into screenBasicWord
    while (y < word.length) {
      //  Letter Element
      let screenBasicLetter = createNode(
        "div",
        "screenBasic-letter",
        word[y],
        y
      );

      // Adding Space at end of word
      screenBasicWord.appendChild(screenBasicLetter.cloneNode(true));
      y++;
    }
    // Adding SpaceBar to element
    let screenBasicLetter = createNode("div", "screenBasic-letter", "_", y);
    screenBasicWord.appendChild(screenBasicLetter.cloneNode(true));

    table.append(screenBasicWord);
    table.childNodes[0].childNodes[0].classList.add("is-current");
  }

  // Converting Words into word
  function createWords(words) {
    console.log(words);
    words.map((word) => {
      if (word != '')
      createWord(word.trim());
    });
    // createWord(words)
  }

  // Converting Data into Array
  function convertDataIntoArray(data) {
    return data.trim().split(" ");
  }

  let dataArray = convertDataIntoArray(data);

  createWords(dataArray);
}

const table = document.getElementById("table");
createTable(table, data);

function getCurrentNode(table, currentWord, currentLetter) {
  return table.childNodes[currentWord].childNodes[currentLetter];
}

function scrollAll(element) {
  
  // Getting value of translateY
  function getValue(str) {
    let value = str.replace('translateY', "").replace('(', "").replace(')', "").replace("px", "")
    return value

  }

  let previousTranlateValue = element.style.transform
  if (previousTranlateValue == "") {
    element.style.transform = "translateY(-58px)"
  } else {
    let value = getValue(previousTranlateValue)
    element.style.transform = `translateY(${value - 58}px)`
  }
  console.log(element.style.transform)
}

function checkAndScrollHeightCurrent(element) {
  let currentElementScrollY = element.parentElement.getBoundingClientRect().y
  let previous = element.parentElement.previousSibling
  // console.log('previous', previous, element) 
  let previousElementScrollY = previous.getBoundingClientRect().y
  // console.log(currentElementScrollY,  previousElementScrollY)
  let sameHeight = (Math.floor(currentElementScrollY) == Math.floor(previousElementScrollY))
  // if ()
  if (!sameHeight) {
    console.log('not-same')
    scrollAll(element.parentElement.parentElement)
  }
}

function getWpm(correct, wrong, minutes) {
  let grossWpm = ((correct + wrong) / 5) / minutes
  return grossWpm
  // Commeting net value cause want to use only gross wpm
  // let netWpm = grossWpm - (wrong / minutes)
  // return netWpm
}

// For capslock check
function checkCapslock(event) {
  if (event.getModifierState("CapsLock")) {
    capslockElement.style.display = "block";
    // console.log('on')
  } else {
    // console.log('off')
    capslockElement.style.display = "none"
  }
  console.log("pressed");
}


function startGame(event) {
  
  // Check if pressed key is space or not
  function checkifspace(event, currentText) {
    if (currentText == ' ') {
      if (event.key == "_" || event.keyCode == 13 ) {
        return true
      }
    }
    return false
  }
  
  // Stopping space-bar scroll
  event.preventDefault();

  // Check capslock
  checkCapslock(event)

  let currentNodeElement = getCurrentNode(table, currentNode, currentLetter);
  currentText = currentNodeElement.innerText;
  currentNodeElement.classList.add("is-current");

  if (currentText == ("" || "_" || " " || "<br>" || '/\n/') || currentText.charCodeAt(0) == 10) {
    currentText = " ";
    event.preventDefault();
  }

  if (event.key == currentText || checkifspace(event, currentText)) {
    currentNodeElement.classList.remove("is-current");
    if (!currentNodeElement.classList.contains("is-wrong")) {
      currentNodeElement.classList.add("is-correct");
    }

    //  For Timeup and timechange
    if (first) {
      first = false;
      let minutes = 1
      // Setting minutes to option value
      minutes = document.getElementById('time-options').value
      time.innerText = minutes * 60
      let timeInterval = setInterval(() => time.innerText -= 1, 1000)

      
      setTimeout(() => {
        //   alert("timeOut");
        let correctWordNumber = document.querySelectorAll(".is-right").length;
        let correctNumber = document.querySelectorAll(".is-correct").length;
        let wrongNumber = document.querySelectorAll(".is-wrong").length;

        // Net commented out cause only want to use grossWpm
        let grossWpm = getWpm(correctNumber, wrongNumber, minutes)
        // let netWpm = getWpm(correctNumber, wrongNumber, minutes)

        document.getElementById(
          "text-inner"
        ).innerText = `
                        Correct : ${correctNumber}
                        Wrong : ${wrongNumber}
                        WPM : ${Math.round(grossWpm)}wpm
                        Accuracy  : ${Math.round(100 - (correctNumber+wrongNumber)/correctNumber)}%
                      `;
        document.getElementById("overlay").style.display = "block";
        // Removing Game
        clearInterval(timeInterval)
        document.removeEventListener("keypress", startGame);
      }, minutes * 60 * 1000);
    }

    // Calling next Word
    if (
      currentNodeElement.id ==
      currentNodeElement.parentElement.childElementCount - 1
    ) {

      currentNode++;
      currentLetter = 0;
      currentNodeElement.parentElement.classList.add("is-right");
      // Checking if have more words ( current word space )
      if (
        currentNode !=
        currentNodeElement.parentElement.parentElement.childElementCount
      ) {
          let current = getCurrentNode(table, currentNode, currentLetter)
          current.classList.add("is-current");
          checkAndScrollHeightCurrent(current)
      } else {
        // When completed para
        console.log("Done");
        document.removeEventListener("keypress", startGame);
      }
    } else {
      currentNodeElement.nextElementSibling.classList.add("is-current");
      currentLetter++;
    }
  } else {
    currentNodeElement.classList.add("is-wrong");
  }
}

let currentNode = 0;
let currentLetter = 0;
let keypressed = 0;
let first = true;

let keypressEvent = document.addEventListener("keypress", startGame, false);

// console.log(table.childNodes[0].childNodes[0].innerText)
