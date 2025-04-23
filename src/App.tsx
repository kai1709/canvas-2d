import './App.css'

import Konva from 'konva';
import { Stage, Layer, Line } from 'react-konva';
import TextInput from './components/TextInput';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Upload, UploadProps } from 'antd';
import CustomImage from './components/CustomImage';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Circle, Eraser, MoveDownRight, PencilLine, RectangleHorizontal, Star } from 'lucide-react';
import KonvaArrow from './components/KonvaArrow';
import KonvaCircle from './components/KonvaCircle';
import KonvaRect from './components/KonvaRect';
import KonvaStar from './components/KonvaStar';

Konva._fixTextRendering = true;

const DEFAULT_IMAGES = [
  'https://res.cloudinary.com/dnxcnqiwu/image/upload/v1739182022/18_zlclbw.png'
]
type TextProps = {
  x: number
  y: number
  id: string
}

export type ImageProps = {
  x: number
  y: number
  src: string
  id: string
  onRemove?: (id: string) => void
}

export type ShapeProps = {
  x: number
  y: number
  id: string
  fill: string
}

function App() {
  const [inputs, setInputs] = useState<TextProps[]>([])
  const [images, setImages] = useState<ImageProps[]>([
    {
      x: 100 + Math.random() * 10 * 8,
      y: 200 + Math.random() * 10 * 8,
      src: DEFAULT_IMAGES[0],
      id: `image_${uuidv4()}`
    }
  ])
  const [fileList, setFileList] = useState([])
  const [arrows, setArrows] = useState<ShapeProps[]>([])
  const [circles, setCircles] = useState<ShapeProps[]>([])
  const stageRef = useRef()
  const [isExporting, setIsExporing] = useState<boolean>(false)
  const [rects, setRects] = useState<ShapeProps[]>([])
  const [stars, setStars] = useState<ShapeProps[]>([])
  const onAddText = () => {
    const newInputs = [...inputs]
    newInputs.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
      id: `text_${uuidv4()}`
    })
    setInputs(newInputs)
  }

  const onAddArrow = () => {
    const newArrows = [...arrows]
    newArrows.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
      id: `shape_${uuidv4()}`,
      fill: 'red'
    })
    setArrows(newArrows)
  }

  const onAddCircle = () => {
    const newCircles = [...circles]
    newCircles.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
      id: `shape_${uuidv4()}`,
      fill: 'red'
    })
    setCircles(newCircles)
  }

  const onAddRect = () => {
    const newRects = [...rects]
    newRects.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
      id: `shape_${uuidv4()}`,
      fill: 'red'
    })
    setRects(newRects)
  }

  const onAddStar = () => {
    const newStars = [...stars]
    newStars.push({
      x: 50 + Math.random() * 10 * 8,
      y: 80 + Math.random() * 10 * 8,
      id: `shape_${uuidv4()}`,
      fill: 'red'
    })
    setStars(newStars)
  }


  const props: UploadProps = {
    accept: '.png,.jpg,.jpeg',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const reader = new FileReader()
      reader.onloadend = function () {
        // @ts-ignore
        setImages([...images, {
          x: 100 + Math.random() * 10 * 8,
          y: 200 + Math.random() * 10 * 8,
          src: reader.result?.toString(),
          id: `image_${uuidv4()}`
        }])
      }
      reader.readAsDataURL(file);
      return false;
    },
    fileList: []
  };

  const onRemove = (id: string) => {
    const newImages = images.filter(img => img.id !== id)
    setImages(newImages)
    const newInputs = inputs.filter(inp => inp.id !== id)
    setInputs(newInputs)

    const newArrows = arrows.filter(img => img.id !== id)
    setArrows(newArrows)
    const newCircles = circles.filter(inp => inp.id !== id)
    setCircles(newCircles)

    const newRects = rects.filter(img => img.id !== id)
    setRects(newRects)
    const newStars = stars.filter(inp => inp.id !== id)
    setStars(newStars)


    setShowMenu(false)
  }

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    if (e.target === e.target.getStage()) {
      return;
    }

    const stage = e.target.getStage();
    const containerRect = stage.container().getBoundingClientRect();
    const pointerPosition = stage.getPointerPosition();

    setMenuPosition({
      x: containerRect.left + pointerPosition.x + 4 - 300,
      y: containerRect.top + pointerPosition.y + 4
    });
    setShowMenu(true);
    setSelectedId(e.target.attrs.id);
    e.cancelBubble = true;
  };

  const onFillColor = (id: string, color: string) => {
    const newArrows = arrows.map(arrow => arrow.id === id ? ({ ...arrow, fill: color }) : arrow)
    setArrows(newArrows)
    const newCircles = circles.map(circle => circle.id === id ? ({ ...circle, fill: color }) : circle)
    setCircles(newCircles)

    const newRects = rects.map(arrow => arrow.id === id ? ({ ...arrow, fill: color }) : arrow)
    setRects(newRects)
    const newStars = stars.map(circle => circle.id === id ? ({ ...circle, fill: color }) : circle)
    setStars(newStars)
    setShowMenu(false)
  }


  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
    script.integrity = 'sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleExport = () => {
    if (stageRef.current && typeof window.jsPDF !== 'undefined') {
      const stage = stageRef.current;
      const pdf = new window.jsPDF('l', 'px', [window.innerWidth - 300, window.innerHeight]);
      pdf.setTextColor('#000000');

      // First add texts
      stage.find('Text').forEach((text) => {
        const size = text.fontSize() / 0.75; // convert pixels to points
        pdf.setFontSize(size);
        pdf.text(text.text(), text.x(), text.y(), {
          baseline: 'top',
          angle: -text.getAbsoluteRotation(),
        });
      });

      // Then put image on top of texts (so texts are not visible)
      pdf.addImage(
        stage.toDataURL({ pixelRatio: 2 }),
        0,
        0,
        window.innerWidth - 300,
        window.innerHeight
      );

      pdf.save('canvas.pdf');
      setIsExporing(false)
    } else {
      console.error('jsPDF library is not loaded or stage is not available');
      alert('jsPDF library is not loaded. In a real project, you need to include it.');
    }
  };

  useEffect(() => {
    if (isExporting) {
      handleExport()
    }
  }, [isExporting])


  console.log({ isExporting })
  return (
    <>
      <div className='flex'>
        <div className='sidebar'>
          <Button type='primary' style={{ width: '100%', marginBottom: 20 }} onClick={onAddText}>Add Text</Button>
          <Upload {...props} style={{ width: '100%' }}>
            <Button type='primary' style={{ width: '100%' }} >Add Image</Button>
          </Upload>
          <Card style={{ marginTop: 12 }}>
            <div>Add Shape</div>
            <div className='flex' style={{ gap: 12 }}>
              <div className='flex-1 text-center shape-btn' onClick={onAddArrow}>
                <div>
                  <MoveDownRight />
                  <div>
                    Arrow
                  </div>
                </div>
              </div>
              <div className='flex-1 text-center shape-btn' onClick={onAddCircle}>
                <div>
                  <Circle />
                  <div>
                    Circle
                  </div>
                </div>
              </div>
            </div>

            <div className='flex' style={{ gap: 12 }}>
              <div className='flex-1 text-center shape-btn' onClick={onAddRect}>
                <div>
                  <RectangleHorizontal />
                  <div>
                    Rectangle
                  </div>
                </div>
              </div>
              <div className='flex-1 text-center shape-btn' onClick={onAddStar}>
                <div>
                  <Star />
                  <div>
                    Star
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop: 12 }}>
            <div>Free Drawing</div>
            <div className='flex' style={{ gap: 12 }}>
              <div className={`flex-1 text-center shape-btn ${tool === 'pen' ? 'tool-active' : ''}`} onClick={() => setTool('pen')}>
                <div>
                  <PencilLine />
                  <div>
                    Line
                  </div>
                </div>
              </div>
              <div className={`flex-1 text-center shape-btn  ${tool === 'eraser' ? 'tool-active' : ''}`} onClick={() => setTool('eraser')}>
                <div>
                  <Eraser />
                  <div>
                    Eraser
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Button type='primary' style={{ width: '100%', marginBottom: 20 }} onClick={() => setIsExporing(true)}>Export to PDF</Button>
        </div>
        <div className='canvas-playground'>
          <Stage ref={stageRef} width={window.innerWidth - 300} height={window.innerHeight} onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}>
            <Layer>
              {inputs.map(input => (
                <TextInput key={input.id} x={input.x} y={input.y} id={input.id} isExporting={isExporting} />
              ))}

              {images.map((image) => (
                <CustomImage key={image.id} src={image.src} x={image.x} y={image.y} onRemove={onRemove} id={image.id} isExporting={isExporting} />
              ))}

              {arrows.map((arrow) => (
                <KonvaArrow key={arrow.id} fill={arrow.fill} x={arrow.x} y={arrow.y} id={arrow.id} />
              ))}

              {circles.map((circle) => (
                <KonvaCircle key={circle.id} fill={circle.fill} x={circle.x} y={circle.y} id={circle.id} />
              ))}

              {rects.map((rect) => (
                <KonvaRect key={rect.id} fill={rect.fill} x={rect.x} y={rect.y} id={rect.id} />
              ))}

              {stars.map((star) => (
                <KonvaStar key={star.id} fill={star.fill} x={star.x} y={star.y} id={star.id} />
              ))}

              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: menuPosition.y,
                left: menuPosition.x,
                width: '120px',
                backgroundColor: 'white',
                boxShadow: '0 0 5px grey',
                borderRadius: '3px',
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  border: 'none',
                  margin: 0,
                  padding: '10px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                onClick={() => onRemove(selectedId)}
              >
                Delete
              </button>
              {selectedId!.includes('shape') && (
                <>
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: 'none',
                      margin: 0,
                      padding: '10px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => onFillColor(selectedId, 'green')}
                  >
                    Fill Green
                  </button>
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: 'none',
                      margin: 0,
                      padding: '10px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => onFillColor(selectedId, 'red')}
                  >
                    Fill Red
                  </button>
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: 'none',
                      margin: 0,
                      padding: '10px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => onFillColor(selectedId, 'black')}
                  >
                    Fill Black
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
