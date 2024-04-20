import React, { useState } from 'react';
import './App.css';

let capsLockOn = false;
let shiftOn = false;
const validCharacters = new Set();
validCharacters.add(',');validCharacters.add('<');
validCharacters.add('.');validCharacters.add('>');
validCharacters.add('/');validCharacters.add('?');
validCharacters.add(';');validCharacters.add(':');
validCharacters.add('\\');validCharacters.add('"');
validCharacters.add('[');validCharacters.add('{');
validCharacters.add(']');validCharacters.add('}');
validCharacters.add('\\');validCharacters.add('|');
validCharacters.add('`');validCharacters.add('~');

validCharacters.add('!');
validCharacters.add( '@');
validCharacters.add( '#');
validCharacters.add( '$');
validCharacters.add( '%');
validCharacters.add( '^');
validCharacters.add( '&');
validCharacters.add( '*');
validCharacters.add('(');
validCharacters.add(')');
validCharacters.add('-');
validCharacters.add('_');
validCharacters.add('+');
validCharacters.add('=');


function App() {
  const [content,setContent] = useState('');
  const [correct,setCorrect] = useState('');
  const [code,setCode] = useState('')
  const [pointer,setPointer] = useState(0)
  
  

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
    
    console.log(e);
    // To get the key itself, access e.key
    // To get the key code, access e.keyCode
    // To get a description of they key, access e.code
    let keycode = e.nativeEvent?.keyCode;
    let key = e.nativeEvent?.key;
    let description = e.nativeEvent?.code;
    
    let inputCharacter;
    if (e.getModifierState){ 
      capsLockOn = (e.getModifierState("CapsLock"))  // Detects capslock
    }
    shiftOn = e.nativeEvent.shiftKey;
    
    // Handle normal keys separately
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
    if(validCharacters.has(key))
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
    let isEnter = function (char: string) { return char.charCodeAt(0) === 10 || char.charCodeAt(0) === 13 };  // ehna falaheen
    let newLine = isEnter(code[pointer]) && isEnter(inputCharacter)
    
    if (newLine) {
      let newPointer = pointer;
      while(!(validCharacters.has(code[newPointer]) || ('A'.charCodeAt(0) <= code[newPointer].toUpperCase().charCodeAt(0) && code[newPointer].toUpperCase().charCodeAt(0) <= 'Z'.charCodeAt(0)) )){
        newPointer += 1
        console.log(newPointer)
      }
      console.log(code[newPointer])
      setPointer(newPointer)
      setCorrect(code.slice(0,newPointer))
      setContent(code.slice(newPointer))
    }
    if (inputCharacter === code[pointer]){
      setPointer(pointer + 1)
      setCorrect(code.slice(0,pointer +1))
      setContent(code.slice(pointer+1))
      //last character is an EOF char probably
      if(pointer === code.length - 1)
        alert("GG")
    }
    
  })
    
  

  // Todo: Hide the words present in form, form should just be there for debugging purposes, not in actual UI
  
  return (
    <div>
          <button style={{ fontSize: '1.5em', padding: '10px' }} onClick={loadfile}>Load File</button> <br/>
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
    </div>
  );
}

export default App;
