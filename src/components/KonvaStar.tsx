import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Star, Transformer } from 'react-konva';
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


const KonvaStar = ({ x, y, id, fill }: ShapeProps) => {
  const imageRef = useRef(null)

  return (
    <>
      <Star
        ref={imageRef}
        x={x}
        y={y}
        numPoints={5}
        innerRadius={30}
        outerRadius={70}
        draggable
        fill={fill}
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
    </>
  );
};

export default KonvaStar
