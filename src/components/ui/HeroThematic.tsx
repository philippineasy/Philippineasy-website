import Image from 'next/image';

interface HeroThematicProps {
  titlePart1: string;
  titlePart2: string;
  titlePart2Color?: 'primary' | 'accent';
  subtitle: string;
  imageUrl: string;
}

export const HeroThematic = ({ titlePart1, titlePart2, titlePart2Color = 'primary', subtitle, imageUrl }: HeroThematicProps) => {
  const colorClass = titlePart2Color === 'primary' ? 'text-primary' : 'text-accent';

  return (
    <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
      <Image
        src={imageUrl}
        alt={`${titlePart1} ${titlePart2}`}
        fill
        priority
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {titlePart1} <span className={colorClass}>{titlePart2}</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
      </div>
    </section>
  );
};
