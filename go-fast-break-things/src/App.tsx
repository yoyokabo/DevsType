import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [content,setContent] = useState('');
  const [correct,setCorrect] = useState('');
  const [code,setCode] = useState('')
  const [pointer,setPointer] = useState(0)
  

  const loadfile = (async () => {
    const response = await fetch(`${process.env.PUBLIC_URL}/binarysearch.txt`)
    if (!response.ok) {
      throw new Error('Failed to fetch file');
      
    }
    setCode(await response.text())
    setContent(code)
    setPointer(0)
  })

  const handleChange = ((e: any) => {
    let curr = e.nativeEvent?.data
    if (curr === code[pointer]){
      setPointer(pointer + 1)
      setCorrect(code.slice(0,pointer +1))
      setContent(code.slice(pointer+1))
    }
    console.log(pointer)

  })
    
  

  return (
    <div>
          <button title='wewo' onClick={loadfile}/> <br/>
          <text style={{ color: 'green' }}>{correct}
            <text style={{ color: 'red' }}>{content}</text>
          </text> 
          <form onChange={(e) => {
            handleChange(e)
          }}>
            <br></br>
          <textarea />
      </form>
    </div>
  );
}

export default App;
