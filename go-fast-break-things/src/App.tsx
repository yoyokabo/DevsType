import React, { useEffect, useState } from 'react';
import './App.css';
import validator from './utils/validator';

let capsLockOn = false;
let shiftOn = false;
let StartTime: Date
let validchars = 0;

function App() {
  const [content,setContent] = useState('');
  const [correct,setCorrect] = useState('');
  // size of what you typed wrong
  const [incorrect,setIncorrect] = useState(0);
  // string of what you typed wrong
  const [wrong,setWrong] = useState('');    
  const [code,setCode] = useState('');
  const [pointer,setPointer] = useState(0);
  const [timeTaken,setTimeTaken] = useState<String>();
  const [cpm,setCpm] = useState<String>();
  
  

  // Todo: work on presentation to make whitespaces more obvious
  const loadfile = (async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/binarysearch.txt`)
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    
    }
    
    await response.text().then((code) => {
      setContent(code)
      setCode(code)
    })
    
    setPointer(0)
  })
  

  const handleChange = ((e: any) => {
    // ignore all events running during IME composition
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    if(pointer === 0){
      StartTime = new Date()
      validchars = 0
    }
    console.log(e);
    // To get the key itself, access e.key
    // To get the key code, access e.keyCode
    // To get a description of they key, access e.code
    let keycode = e.nativeEvent?.keyCode;
    let key = e.nativeEvent?.key;
    let description = e.nativeEvent?.code;
    

    // declaring temp variables for the react states
    // _t stands for temp as we will set the react states at the end of the function
    let content_t = content;
    let correct_t = correct;
    let incorrect_t = incorrect;
    let wrong_t = wrong;
    let code_t = code;
    let pointer_t = pointer;
    let timeTaken_t = timeTaken;
    let cpm_t = cpm;
  

    let inputCharacter;
    if (e.getModifierState){ // Detects capslock
      capsLockOn = (e.getModifierState("CapsLock"))  
    }
    shiftOn = e.nativeEvent.shiftKey;
    
    // Handle normal keys separately
    // if(validator.isLetter(key)){
    //   inputCharacter = key
    // }
    if('A'.charCodeAt(0) <= keycode && keycode <= 'Z'.charCodeAt(0)){
      if(capsLockOn !== shiftOn)
        // The letter is capitalized
        inputCharacter = String.fromCharCode(keycode);
      else inputCharacter = String.fromCharCode(keycode + ('a'.charCodeAt(0) - 'A'.charCodeAt(0)) );
    }

    // Handle all digits
    if( 0 <= Number(key) && Number(key) <= 9)
      inputCharacter = key;
    
    //Handle all special characters other than whitespaces
    if(validator.isValidSymbol(key))
      inputCharacter = key;

    
    //TODO: be more lenient with the whitespaces
    // Handle whitespaces
    
    switch (description){
      case "Enter":
        inputCharacter = '\n';
        break;
      case "Space":
        inputCharacter = ' ';
        break;
      case "Tab":
        inputCharacter = '\t';
        break;
      case "Backspace":
        if (incorrect_t > 0) {
          incorrect_t--;
          wrong_t = wrong_t.slice(0,incorrect_t);
        }  
        break;
    }
    console.log(inputCharacter);

    if(inputCharacter === undefined){
      console.log('Unrecognized input character!');
      setIncorrect(incorrect_t);
      setWrong(wrong_t);
      return;
    }

    if (validator.isEnter(inputCharacter) && validator.isEnter(code_t[pointer_t])) {  // SUS
      while(!(validator.isValid(code_t[pointer_t]))){
        pointer_t += 1
      }
      correct_t = code_t.slice(0,pointer_t);
      content_t = code_t.slice(pointer_t);
    }
    else if (incorrect_t === 0 && inputCharacter === code_t[pointer_t]){
      ++validchars;
      ++pointer_t
      correct_t = code_t.slice(0,pointer_t)
      content_t = code_t.slice(pointer_t)

      //last character is an EOF char probably
      if(pointer_t === code_t.length - 1){
        let now = new Date()
        let seconds = (now.getTime() - StartTime.getTime() ) /1000
        timeTaken_t = seconds.toString();
        pointer_t = 0;
        correct_t = "";
        code_t = code_t.slice(1);
        cpm_t = (validchars/seconds*60).toString();
      }   
    }
    else {
      ++incorrect_t;
      wrong_t += key;
    }

    setContent(content_t);
    setCorrect(correct_t);
    setIncorrect(incorrect_t);
    setWrong(wrong_t);
    setCode(code_t);
    setPointer(pointer_t);
    setTimeTaken(timeTaken_t);
    setCpm(cpm_t);
  })
    
  useEffect(()=>{
    loadfile()
  },[])

  // Todo: Hide the words present in form, form should just be there for debugging purposes, not in actual UI
  
  return (
    <div>
          <pre style={{color: 'green', backgroundBlendMode: "hue", backgroundColor: "ButtonShadow"}}>{correct}
          </pre> 
            <pre style={{ color: 'blue' }}>{content}
            </pre>
            <pre style={{ color: 'red' }}>{wrong}
            </pre>
          <form onKeyDown={(e) => {
            handleChange(e)
          }}>
            <br></br>
          <textarea />
      </form>
      <text>Your Time : {timeTaken}</text>
      <br/>
      <text>Your CPM : {cpm}</text>
    </div>
  );
}

export default App;
