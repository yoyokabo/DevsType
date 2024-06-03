import { useRef , useEffect, useState } from 'react';
import './App.css';
import validator from './utils/validator';
import Blink from './components/blink';

let capsLockOn = false;
let shiftOn = false;
let StartTime: Date
let validchars = 0;
let shadowtime: Date

function App() {
  // Finished Flag
  let finished = false;
  // Added Master to store code for reset.
  const [shadow, setShadow] = useState('PlaceHolder');
  const [master,setMaster] = useState('');
  const [content,setContent] = useState('');
  const [correct,setCorrect] = useState('');
  // size of what you typed wrong
  const [incorrect,setIncorrect] = useState(0);
  // string of what you typed wrong
  const [wrong,setWrong] = useState('');    
  const [code,setCode] = useState('');
  const [pointer,setPointer] = useState(0);
  const [timeTaken,setTimeTaken] = useState<String>();
  const [cpm,setCpm] = useState<string>();
  
  const winRef = useRef(window)

  // Todo: work on presentation to make whitespaces more obvious
  const loadfile = (async (type = "python") => {
    const response = await fetch(`${process.env.PUBLIC_URL}/${type}.txt`)
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    
    }
    
    await response.text().then((code) => {
      setMaster(code)
      setContent(code)
      setCode(code)
    })
    setPointer(0)
    setCorrect('')
    setIncorrect(0)
    setWrong('')
  })
  
  const something = ((e: any) => { 
    loadfile(e.target.value)
  })

  const restart = ((e:any) => {
    setPointer(0)
    setCorrect('')
    setIncorrect(0)
    setWrong('')
    setContent(master)
    setCode(master)
  })

  const startShadow = (async (cpm:string) => {
    const chars = parseFloat(cpm)
    const rate = chars / 60
    shadowtime = new Date()
    renderShadow(rate)
  })
  const renderShadow = ((rate:number) => {
    shadowtime = new Date()
    let seconds = (shadowtime.getTime() - StartTime.getTime() ) /1000
    let total = Math.floor(seconds * rate)
    setShadow(master.slice(total,total + 10))
    
    setTimeout(renderShadow, 100,rate);
    

  }) 

  

  const handleChange = ((e: any) => {
    e.preventDefault()  // Prevents space from scrolling
    // ignore all events running during IME composition
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    if(pointer === 0){
      StartTime = new Date()
      validchars = 0
      if (cpm != null){
        startShadow(cpm)
      }

    }
    console.log(e);
    // To get the key itself, access e.key
    // To get the key code, access e.keyCode
    // To get a description of they key, access e.code
    let keycode = e.keyCode;
    let key = e.key;
    console.log(key)

    let description = e.code;
    

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
    shiftOn = e.shiftKey;
    console.log(pointer)
    console.log(code[pointer])
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

    if (validator.isEnter(inputCharacter) && validator.isEnter(code_t[pointer_t]) && incorrect_t === 0) {  // SUS
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
      if(pointer_t === code_t.length){
        let now = new Date()
        let seconds = (now.getTime() - StartTime.getTime() ) /1000
        timeTaken_t = seconds.toString();
        pointer_t = 0;
        correct_t = code
        cpm_t = (validchars/seconds*60).toString();
        finished = true;
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

  // Adds event listener to whole window instead of textbox
  useEffect(() => {
    winRef.current.addEventListener('keydown', handleChange);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      winRef.current.removeEventListener('keydown', handleChange); // removed because it will keep adding new event listners everytime otherwise
    };
  })

  // Todo: Hide the words present in form, form should just be there for debugging purposes, not in actual UI
  
  return (
    <>
    <div style={{display: 'block',flexWrap: "wrap" ,justifyContent:"flex-start"}}>
    <label style={{fontSize:"40px"}} >Choose a Language:</label>
    <select style={{fontSize:"40px"}}id="language" onChange={something} name="language">
      <option value="python">Python</option>
      <option value="c++">C++</option>
      <option value="javascript">JavaScript</option>
    </select>
    
    <div style={{backgroundColor:"rgb(45,45,52)", width:"70%", marginLeft:"15%",marginTop:"5%",borderStyle:"solid",borderBlockWidth:"10px",borderBlockColor:"black"}}>
      
          <pre style={{fontSize:"36px", textAlign:"left"}}>
            <span style={{color: 'White'}}>{correct}</span>
            <span style={{color: 'red'}}>{wrong}</span>
            <Blink text='_'></Blink>
            <span style={{color: 'Grey'}}>{content}</span>
          </pre>
          
          </div>
          <button style={{display:"inline" , left:"100%",marginLeft:"81.1%",fontSize:"24px"}}  onClick={restart}>Restart</button>
          <div style={{textAlign:"center",fontSize:"40px"}}>
          
          <text style={{ color: 'white' }}>Your Shadow: {shadow}</text>
          <br/>
          <text style={{ color: 'white' }}>Your Time : {timeTaken}</text>
          
          
          <br/>
          <text style={{ color: 'white' }}>Your CPM : {cpm}</text>
          </div>
    </div>
    
    
          
  </>
  );
}

export default App;
