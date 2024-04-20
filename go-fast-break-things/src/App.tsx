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
    
    // for(let i:number=0; i<code.length; ++i){
    //   console.log(code.charCodeAt(i));
    // }
    setPointer(0)
  })
  

  const handleChange = ((e: any) => {
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
    if(description === "Enter")
      inputCharacter = '\n';
    if(description === "Space")
      inputCharacter = ' ';
    if(description === 'Tab')
      inputCharacter = '\t';

    console.log(inputCharacter);

    if(inputCharacter === undefined){
      console.log('Unrecognized input character!');
      return;
    }
    
    if (validator.isEnter(code[pointer])) {
      let newPointer = pointer;
      while(!(validator.isValid(code[newPointer]))){
        newPointer += 1
      }
      setPointer(newPointer)
      setCorrect(code.slice(0,newPointer))
      setContent(code.slice(newPointer))
    }
    if (inputCharacter === code[pointer]){
      validchars = validchars + 1
      setPointer(pointer + 1)
      setCorrect(code.slice(0,pointer +1))
      setContent(code.slice(pointer+1))
      //last character is an EOF char probably
      if(pointer === code.length - 1){
        let now = new Date()
        let seconds = (now.getTime() - StartTime.getTime() ) /1000
        setTimeTaken(seconds.toString())
        setCpm((validchars/seconds).toString())

      }
        
        
    }
    
  })
    
  useEffect(()=>{
    loadfile()
  },[])

  // Todo: Hide the words present in form, form should just be there for debugging purposes, not in actual UI
  
  return (
    <div>
          <pre style={{color: 'green', backgroundBlendMode: "hue", backgroundColor: "ButtonShadow"}}>{correct}
          </pre> 
            <pre style={{ color: 'red' }}>{content}
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
