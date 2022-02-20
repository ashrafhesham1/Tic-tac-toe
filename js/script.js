//declaring variables

//game state
let gameState = [null,null,null,null,null,null,null,null,null]
let isStarted = false;
let gameType= null ; // 0=>player plays with 'x' , 1=> player plays with 'o'
let freze = null ;   //freze playing button's if it's computer's turn

//globals
const gameContainer = document.querySelector('.game-container');
const winningCases = [
    [0, 1, 2] , [3, 4, 5] , [6, 7, 8] ,
    [0, 3, 6] , [1, 4, 7] , [2, 5, 8] ,
    [0, 4, 8] , [2, 4, 6]
]

//game masseges
const chooseMsg        = 'Choose!' ;
const gameIsStartedMsg = 'The Game is already started. Press \"Reset\" to restart' ;
const computersTurnMsg = 'computer\'s turn, ......Thinking!' ;
const playersTurnMsg   = 'player\'s turn' ;
const restartGameMsg   = 'Game has been restarted' ;
const winnerMsg        = 'looks like we have a winner! : ' ;
const drawMsg          = 'looks like this round is draw!' ;

//handling game start

document.querySelector('#x-btn').addEventListener('click',()=>{
   
    if (!isStarted){
        isStarted=true
        gameType=0;
        playerPlays();
    }
   
    else{
        alert(gameIsStartedMsg)
    }

});

document.querySelector('#o-btn').addEventListener('click',()=>{
    
    if (!isStarted){
        isStarted=true
        gameType=1;
        computerPlays();
    }
   
    else{
        alert(gameIsStartedMsg)
    }

});

//reseting game cells internal & external state
const resetgameState = () =>{

    gameState = [null,null,null,null,null,null,null,null,null] ;

    for ( cell of gameContainer.querySelectorAll('.game-cell')){
        cell.textContent='';
        let cellClasses = cell.classList;
        cellClasses.remove('o-pressed');
        cellClasses.remove('x-pressed');
        cell.setAttribute('data-cell-state','0');
    }
}

//reset button
document.querySelector('#reset-btn').addEventListener('click',()=>{
    
    //reset internal state
    isStarted=false;
    freze=null;
    gameType=null;

    //reset external state
    resetgameState();

    document.querySelector('#msg-label').textContent=chooseMsg;
    document.querySelector('#score-player').textContent='0';
    document.querySelector('#score-computer').textContent='0';
    document.querySelector('#again-btn').style.visibility='hidden';

    alert(restartGameMsg);

});

//handling user interaction
gameContainer.addEventListener('click',event=>{

    if (isStarted && !freze && !isChecked(event.target)){
        
        //marking the cell as choosen
        event.target.setAttribute('data-cell-state','1');

        //extracting the cell's number
        let choice = null;
        switch(event.target.id){
            case 'cell1' : choice=1; break;
            case 'cell2' : choice=2; break;
            case 'cell3' : choice=3; break;
            case 'cell4' : choice=4; break;
            case 'cell5' : choice=5; break;
            case 'cell6' : choice=6; break;
            case 'cell7' : choice=7; break;
            case 'cell8' : choice=8; break;
            case 'cell9' : choice=9; break;
        };

        //updating the state
        if(gameType==0){
            setVal('x',event.target);
            gameState[choice-1]='x';
        }

        else if (gameType==1){
            setVal('o',event.target);
            gameState[choice-1]='o';
        }


        if (!checkWinner())
             computerPlays();
    }

});

//play again button
document.querySelector('#again-btn').addEventListener('click',()=>{
   
    //reset the state    
    resetgameState();
    document.querySelector('#again-btn').style.visibility='hidden';

    //give the controle to the player / the computer
    if (gameType===0)
        playerPlays()
    else
        computerPlays()

})

const playerPlays = () => {

    freze=false
    document.querySelector('#msg-label').textContent= playersTurnMsg;

    //cells click event listner will handle the player interaction

}

const computerPlays = () => {

    freze=true
    document.querySelector('#msg-label').textContent=computersTurnMsg;

    setTimeout(()=>{    //compuer will wait 0.5 sec before playing
        
        let numChoice = computerChoice()+1;

        //mapping computer choice into an Id
        let choice = null;
        switch(numChoice){

            case 1 : choice='cell1'; break;
            case 2 : choice='cell2'; break;
            case 3 : choice='cell3'; break;
            case 4 : choice='cell4'; break;
            case 5 : choice='cell5'; break;
            case 6 : choice='cell6'; break;
            case 7 : choice='cell7'; break;
            case 8 : choice='cell8'; break;
            case 9 : choice='cell9'; break;

        }

        //marking the cell as choosen && updat its state

        document.querySelector(`#${choice}`).setAttribute('data-cell-state','1');

        if (gameType==0){

            setVal('o',document.querySelector(`#${choice}`));
            gameState[numChoice-1]='o';

        }

        else if (gameType==1){

            setVal('x',document.querySelector(`#${choice}`));
            gameState[numChoice-1]='x';

        }

        if (!checkWinner())
            playerPlays();

    },500)

}

const computerChoice = () => {

    const computerPlayLetter = gameType==0 ? 'o' : 'x' ; 
    const playerPlayLetter = gameType==0 ? 'x' : 'o' ; 

    //if computer needs one move to win
    for (winCase of winningCases){

        const [a,b,c] = winCase ;

        if ( gameState[a]===gameState[b] && gameState[a]===computerPlayLetter
             && gameState[c]===null)
            return c ;

        if ( gameState[a]===gameState[c] && gameState[a]===computerPlayLetter
                && gameState[b]===null)
               return b ;

        if ( gameState[b]===gameState[c] && gameState[b]===computerPlayLetter
                && gameState[a]===null)
               return a ;

    }

    //if the player needs one move to win
    for (winCase of winningCases){

        const [a,b,c] = winCase ;

        if ( gameState[a]===gameState[b] && gameState[a]===playerPlayLetter
             && gameState[c]===null)
            return c ;

        if ( gameState[a]===gameState[c] && gameState[a]===playerPlayLetter
                && gameState[b]===null)
               return b ;

        if ( gameState[b]===gameState[c] && gameState[b]===playerPlayLetter
                && gameState[a]===null)
               return a ;

    }

    //if the computer checked one cell in a row/col/diagonal
    for ( let i = 0 ; i < 7 ; i++ ){

        if (gameState[i]===computerPlayLetter && gameState[i+1]===null)
            return (i+1);

        if (gameState[i]===computerPlayLetter && gameState[i+2]===null)
            return (i+2);   

    }

    //if the user checked one cell in a row/col/diagonal
    for ( let i = 0 ; i < 7 ; i++ ){

        if (gameState[i]===playerPlayLetter && gameState[i+1]===null)
            return (i+1);

        if (gameState[i]===playerPlayLetter && gameState[i+2]===null)
            return (i+2) ;

    }

    //default case
    for ( let i = 0 ; i < 9 ; i++ ){

        if (gameState[i]===null)
            return i;

    }

}

const checkWinner = () => {

    gameWon = false;
    let a,b,c ;

    //detecting if there is a winner 
    for (winCase of winningCases){

        [a,b,c] = winCase;
        if (gameState[a] !== null && gameState[b] !== null && gameState[c] !== null){
            if (gameState[a]===gameState[b] && gameState[b]===gameState[c]){
                gameWon = true ;
                break ;

            }
        }
    }
    
    if (gameWon){

        freze = true ;

                //detecting winner 
                const playerPlayLetter = gameType===0 ? 'x' : 'o';
                const winner = playerPlayLetter===gameState[a] ? 'player' : 'computer';

                //updating score
                if (winner==='player'){
                    const playerScore = document.querySelector('#score-player');
                    playerScore.textContent=Number(playerScore.textContent)+1;
                }
                else if (winner==='computer'){
                    const computerScore = document.querySelector('#score-computer');
                    computerScore.textContent=Number(computerScore.textContent)+1;
                }

                //showing winner msg
                document.querySelector('#msg-label').textContent = winnerMsg + winner ;

                //displaying play again button
                document.querySelector('#again-btn').style.visibility='visible';
                return true;
    }

    //detecting draw
    gameDraw = ! gameState.includes(null);

    if (gameDraw){

        freze =true

        //show draw msg
        document.querySelector('#msg-label').textContent = drawMsg ;

        //displaying play again button
        document.querySelector('#again-btn').style.visibility='visible';
        return true;
    }
    return false ;
}


//Helper functions

 const setVal = (val,elem)=>{

    if(val==='x'){
        elem.textContent='X';
        elem.classList.add('x-pressed');
    }
    else if (val==='o'){
        elem.textContent='O'
        elem.classList.add('o-pressed');   
    }

 };

 const isChecked = (elem)=>{

    let played = elem.getAttribute('data-cell-state');

    if (played == "1"){
        return true;
    }
        return false;
        
 };