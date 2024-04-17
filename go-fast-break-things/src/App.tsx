import React, { useState } from 'react';
import logo from './logo.svg';
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
    
    setCode(await response.text())
    setContent(code)
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
    console.log(key);
    console.log(keycode);
    
    let inputCharacter;
    if(keycode == "CapsLock")
      capsLockOn = !capsLockOn;
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

    console.log(inputCharacter);
    //TODO: be more lenient with the whitespaces
    // Handle whitespaces
    if(description == "Enter")
      inputCharacter = '\n';
    if(description == "Space")
      inputCharacter = ' ';
    if(description == 'Tab')
      inputCharacter = '\t';

    if(inputCharacter == undefined){
      console.log('Unrecognized input character!');
      return;
    }

    if (inputCharacter === code[pointer]){
      setPointer(pointer + 1)
      setCorrect(code.slice(0,pointer +1))
      setContent(code.slice(pointer+1))
      //last character is an EOF char probably
      if(pointer == code.length - 1)
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
