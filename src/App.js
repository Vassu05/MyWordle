import { useEffect, useState } from 'react';
import './App.css';
import axios  from 'axios';
// const wordle = "SUPER";


const url =  "https://raw.githubusercontent.com/WebDevSimplified/wordle-clone/main/dictionary.json";

function App() {
  const [answer,setAnswer] = useState(""); 
  const [words,setWords] = useState([]);
  const [guesses,setGuesses] = useState(Array(6).fill(null));
  const [currentGuess,setCurrentGuess] = useState("");
  const [isCorrect,setCorrect] = useState(false);
  const [isOver,setIsOver] = useState(false);

  const getAPI = async ()=>{
    const res = await axios.get(url);
    const words = res.data;
    setWords(res.data);
    console.log(res.data);
    setAnswer(words[Math.floor(Math.random()*words.length)].toLocaleUpperCase());
  }

  useEffect(()=>{
    getAPI();
  },[]);
  function handleClick(event){
    if(isCorrect){
      return;
    }
    const letter = event.target.value.toLocaleUpperCase();
    if(letter === 'ENTER'){
      if(currentGuess.length < 5){
        return;
      }
      if(answer === currentGuess.toLocaleUpperCase()){
        setCorrect(true);
        setIsOver(true);
      }
      if (!words.includes(currentGuess.toLocaleLowerCase())) {
        console.log(currentGuess,answer);
        alert("Not In Wordlist");
        return;
      }
      const newGuesses = [...guesses];
      if (guesses.findIndex((val) => val == null) === 5) {
        setIsOver(true);
      }
      newGuesses[guesses.findIndex((val)=> val===null)] = currentGuess.toUpperCase();
      setGuesses(newGuesses);
      setCurrentGuess("");
    }
    else if(letter === '<<'){
      setCurrentGuess(currentGuess.slice(0,-1));
      return; 
    }
    if (currentGuess.length >= 5) {
      return;
    }
    else if((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z')){
      setCurrentGuess(currentGuess+letter);
    }
  }

  useEffect(() => {
    const handleKey = (event) => {
      if(isCorrect){
        return;
      }
      if (event.key === "Enter") {
        if (currentGuess.length < 5) {
          return;
        }
        if (!words.includes(currentGuess.toLocaleLowerCase())) {
          alert("Not In Wordlist");
          return;
        }
        if(answer === currentGuess.toLocaleUpperCase()){
          setCorrect(true);
          setIsOver(true);
        }
        const newGuesses = [...guesses];
        if (guesses.findIndex((val) => val == null) === 5) {
          setIsOver(true);
        }
        newGuesses[
          guesses.findIndex((val) => val == null)
        ] = currentGuess.toUpperCase();
        setGuesses(newGuesses);
        setCurrentGuess("");
      }
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }
      if (currentGuess.length >= 5) {
        return;
      }
      if (event.keyCode >= 65 && event.keyCode <= 91) {
        setCurrentGuess(currentGuess + event.key);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGuess, guesses,words,answer,isCorrect]);
  return (
    <div className="App">
      <h1>Wordle</h1>
      {(isOver) && (isCorrect ? <div className='floating'>Fantastic!</div> : <div className='floating'>The word was {answer}</div>)}
      {guesses.map((guess,i)=>{
        const isCurrentGuess = i === guesses.findIndex((val) => val === null);
        return <Line guess={isCurrentGuess ? currentGuess.toLocaleUpperCase() : guess ?? ""} 
          answer={answer}
          isFinal = {!isCurrentGuess && guess!=null}
        />;
      })}
      <KeyBoard handleClick={handleClick}/>
    </div>
  );
}



function Line({guess,answer,isFinal}){
  const tiles = [];
  const tiles1 = [];
  let temp = answer;
  for(var i=0;i<5;i++){
    let ch = guess[i];
    let className = "tile";
    if (isFinal) {
      if (ch === temp[i]) {
        className += " green";
        temp = temp.replace(ch,"-");
      }
    }
    tiles1.push(
      {className,ch}
    );
  }
  for(i=0;i<5;i++){
    if(isFinal){
      if(tiles1[i].className.length <= 5){
        if(temp.includes(guess[i])){
          console.log(temp,guess[i]);
          tiles1[i].className += " yellow";
          temp = temp.replace(guess[i],"_");
        }
        else{
          tiles1[i].className += " grey";
        }
      }
    }
  }
  for(i=0;i<5;i++){
    tiles.push(<div className={tiles1[i].className}>{tiles1[i].ch}</div>)
  }
  return <div className='line'>{tiles}</div>;
}

function KeyBoard({handleClick}){
  const key_values = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','<<'];
  const keys = [];
  for(var i=0;i<28;i++){
    keys.push(<button onClick={handleClick} value={key_values[i]} className='key'>{key_values[i]}</button>);
  }
  return <div className='key_board'>{keys}</div>
}



export default App;
