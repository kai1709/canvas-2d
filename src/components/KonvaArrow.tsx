import { useEffect, useMemo, useRef, useState } from 'react';
import { Arrow, Transformer } from 'react-konva';
import useImage from 'use-image';
import { ImageProps, ShapeProps } from '../App';

function getCrop(image, size, clipPosition = 'center-middle') {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  if (clipPosition === 'left-top') {
    x = 0;
    y = 0;
  } else if (clipPosition === 'left-middle') {
    x = 0;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'left-bottom') {
    x = 0;
    y = image.height - newHeight;
  } else if (clipPosition === 'center-top') {
    x = (image.width - newWidth) / 2;
    y = 0;
  } else if (clipPosition === 'center-middle') {
    x = (image.width - newWidth) / 2;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'center-bottom') {
    x = (image.width - newWidth) / 2;
    y = image.height - newHeight;
  } else if (clipPosition === 'right-top') {
    x = image.width - newWidth;
    y = 0;
  } else if (clipPosition === 'right-middle') {
    x = image.width - newWidth;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'right-bottom') {
    x = image.width - newWidth;
    y = image.height - newHeight;
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}


const KonvaArrow = ({ x, y, id, fill }: ShapeProps) => {
  const imageRef = useRef(null)
  const [size, setSize] = useState({ pointerLength: 20, pointerWidth: 20, points: [0, 0, 100, 100] });
  const trRef = useRef(null);
  const handleTransform = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const currentPoints = node.points()
    setSize({
      pointerLength: Math.max(5, node.pointerLength() * scaleX),
      pointerWidth: Math.max(5, node.pointerWidth() * scaleY),
      points: [Math.max(5, currentPoints[0] * scaleX), Math.max(5, currentPoints[1] * scaleY), Math.max(5, currentPoints[2] * scaleX), Math.max(5, currentPoints[3] * scaleY)]
    });
  };

  useEffect(() => {
    if (imageRef.current && trRef.current) {
      trRef.current.nodes([imageRef.current]);
    }
  }, []);
  return (
    <>
      <Arrow
        ref={imageRef}
        x={x}
        y={y}
        points={size.points}
        pointerLength={size.pointerLength}
        pointerWidth={size.pointerWidth}
        draggable
        fill={fill}
        onTransform={handleTransform}
        stroke="black"
        strokeWidth={4}
        id={id}
        onMouseEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onMouseLeave={() => {

          document.body.style.cursor = 'default';
        }}
      />
      <Transformer
        ref={trRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
};

export default KonvaArrow
