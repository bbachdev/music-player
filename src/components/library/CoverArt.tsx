import { SyntheticEvent, useEffect, useState } from 'react';

interface AlbumArtProps {
  className?: string
  src: string
  fallbackSrc: string
  alt: string
}

export default function CoverArt({ className = '', src, fallbackSrc, alt} : AlbumArtProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault();
    setImageSrc(fallbackSrc);
    return true
  };

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <>
      <img className={className} src={imageSrc} alt={alt} onError={(e) => handleImageError(e)} />
    </>
  )
}