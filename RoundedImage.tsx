"use client";

import Image from "next/image";

interface RoundedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function RoundedImage({
  src,
  alt,
  width = 40,
  height = 40,
  className = "",
}: RoundedImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
}