// components/Image.jsx

import NextImage from "next/image";

export default function Image({
  width = 64,
  height = 64,
  ...props
}) {
  return (
    <NextImage
      width={width}
      height={height}
      {...props}
    />
  );
}