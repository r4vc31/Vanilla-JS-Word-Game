let word;
let userInput;
let attempt_number = 1;
const rows = document.querySelectorAll('.row');

rows.forEach(element => element.addEventListener('click', function(event){
    const cell = event.target;
    if(cell.title.includes('r'+attempt_number)){
        console.log('sds');
    }else{
        alert('You have to complete the previous attempt')
        document.querySelector(`[title='r${attempt_number}-c1']`).focus();
    }
    console.log(cell);
}))

async function getWord(){
    const promise = await fetch('https://words.dev-apis.com/word-of-the-day');
    const result = await promise.json();
    return result.word;
}

async function validateWord(){
    const promise = await fetch('https://words.dev-apis.com/validate-word', {
        method: 'POST',
        body: JSON.stringify({
            word: 't3st',
        })
    });

    const result = await promise.json();
    return result.validWord;
}


async function init() {
    word = await getWord();
    console.log(word);
    console.log(await validateWord());
}

init();