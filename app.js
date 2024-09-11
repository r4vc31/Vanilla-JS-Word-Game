let word;
let userInput;
let attempt_number = 1;
const rows = document.querySelectorAll('.row');
const cells = document.querySelectorAll('.cell');
const messageElement = document.querySelector('p.message');
let correctLetters = 0;

rows.forEach(element => element.addEventListener('click', function (event) {
  const cell = event.target;
  if (!cell.title.includes('r' + attempt_number)){
    showMessage('You need to complete the current attempt');
    document.querySelector(`[title='r${attempt_number}-c1']`).focus();
  }
}))

cells.forEach(element => element.addEventListener("keydown", async function (event) {
  const currentCellTitle = element.title;
  event.preventDefault();
  if (!isLetter(event.key)) {
    if (event.key === 'Backspace') {
      element.value = '';
      if (currentCellTitle.slice(-1) !== '1') {
        previousCellTitle = currentCellTitle.slice(0, -1) + (parseInt(currentCellTitle.slice(-1)) - 1);
        document.querySelector(`[title='${previousCellTitle}']`).focus();
      }
    } else if (event.key === 'Enter') {
      const word = getWordInRow();
      if (word.length === 5) {
        const isValid = await validateWord(word);
        if (isValid) {
          showMessage('Word Valid. Coloring...')
          compareWords(word);
          if (correctLetters === 5) {
            showMessage('Winner!')
            disableAfterWin();
          } else if (attempt_number < 6) {
            showMessage('Try Again!')
          }
          else {
            showMessage('Loser?!')
            return;
          }
          attempt_number++;
          document.querySelector(`[title='r${attempt_number}-c1']`).focus();
        } else {
          showMessage('That is not a valid word')
        }
      } else[
        showMessage('You need to complete the word')
      ]
    }
  } else {
    element.value = event.key;
    if (currentCellTitle.slice(-1) !== '5') {
      nextCellTitle = currentCellTitle.slice(0, -1) + (parseInt(currentCellTitle.slice(-1)) + 1);
      document.querySelector(`[title='${nextCellTitle}']`).focus();
    }
  }

}));

async function getWord() {
  const promise = await fetch('https://words.dev-apis.com/word-of-the-day');
  const result = await promise.json();
  return result.word;
}

async function validateWord(word) {
  const promise = await fetch('https://words.dev-apis.com/validate-word', {
    method: 'POST',
    body: JSON.stringify({
      word: word,
    })
  });

  const result = await promise.json();
  return result.validWord;
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function showMessage(message) {
  messageElement.innerHTML = message;
  messageElement.style.display = "block";
  setTimeout(function () {
    messageElement.style.display = "none";
  }, 3000);
}

function getWordInRow() {
  let word = '';
  for (let index = 0; index < 5; index++) {
    const element = document.querySelector(`[title='r${attempt_number}-c${index + 1}']`);
    const letter = element.value;
    word += letter;
  }
  return word;
}

function compareWords(userWord) {
  const letters = [...word];
  for (let index = 0; index < 5; index++) {
    let color = 'gray';

    const letterUser = userWord[index].toUpperCase();
    const letterMachine = word[index].toUpperCase();

    if (letterUser === letterMachine) {
      color = 'green';
      letters.splice(index, 1);
      correctLetters++;
    } else if (letters.includes(letterUser)) {
      color = 'yellow';
      letters.splice(letters.indexOf(letterUser), 1);
    }

    const cell = document.querySelector(`[title='r${attempt_number}-c${index + 1}']`);
    cell.style.backgroundColor = color;
    cell.disabled = true;
  }

}

function disableAfterWin() {
  console.log(attempt_number, rows.length);
  for (let index = attempt_number; index < rows.length + 1; index++) {
    for (let j = 0; j < word.length; j++) {
      const cell = document.querySelector(`[title='r${index}-c${j + 1}']`);
      cell.disabled = true;
    }
  }
}

async function init() {
  word = await getWord();
  word = word.toUpperCase();
  console.log(word);
}

init();