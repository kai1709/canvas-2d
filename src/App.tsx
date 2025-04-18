import './App.css'

import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import TextInput from './components/TextInput';
import { useEffect, useState } from 'react';
import { Button } from 'antd';

Konva._fixTextRendering = true;

function App() {
  const [inputs, setInputs] = useState([
    { x: 50, y: 80 }
  ])
  useEffect(() => {

  }, [])
  const onAddText = () => {
    const newInputs = [...inputs]
    newInputs.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
    })
    setInputs(newInputs)
  }
  return (
    <>
      <Button type='primary' onClick={onAddText}>Add Text</Button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {inputs.map(input => (
            <TextInput key={input.x} x={input.x} y={input.y} />
          ))}
        </Layer>
      </Stage>
    </>
  )
}

export default App
