import React from 'react';

interface AuthShowcaseProps {
  bg: string;
  images: { src: string; className: string; alt?: string }[];
  title: string;
  description: React.ReactNode;
}

export const AuthShowcase: React.FC<AuthShowcaseProps> = ({ bg, images, title, description }) => {
  return (
    <div
      className="rounded-xl relative bg-no-repeat bg-cover bg-center w-full h-full flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Layer images */}
      {images.map((img, i) => (
        <img key={i} {...img} />
      ))}

      {/* Text */}
      <div className="flex flex-col text-center justify-center items-center gap-1 bottom-20 absolute left-5 right-5">
        <h1 className="text-white text-5xl font-medium whitespace-nowrap">{title}</h1>
        <p className="text-white text-base">{description}</p>
      </div>
    </div>
  );
};
