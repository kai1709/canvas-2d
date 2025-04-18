import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { ImageProps } from '../App';

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


const CustomImage = ({ src, x, y, onRemove, id, isExporting }: ImageProps) => {
  const [image] = useImage(src)
  const [position, setPosition] = useState('center-middle');
  const imageRef = useRef(null)
  const [size, setSize] = useState({ width: 300, height: 100 });
  const trRef = useRef(null);
  const handleTransform = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);
    setSize({
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  const crop = useMemo(() => {
    if (!image) return null;
    return getCrop(image, size, position);
  }, [image, size, position]);

  useEffect(() => {
    if (image && imageRef.current && trRef.current) {
      trRef.current.nodes([imageRef.current]);
    }
  }, [image]);

  return (
    <>
      <Image
        image={image}
        ref={imageRef}
        x={x}
        y={y}
        width={size.width}
        height={size.height}
        draggable
        {...crop}
        id={id}
        onMouseEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onMouseLeave={() => {

          document.body.style.cursor = 'default';
        }}
        onTransform={handleTransform}
        onDblTap={() => {
          console.log("double tap")
          onRemove?.(id)
        }}
      />
      {!isExporting && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default CustomImage
