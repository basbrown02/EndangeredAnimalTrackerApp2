import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export const HowItWorks = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background without wave */}
      <div className="relative w-full">
        <Image
          src="/background2.png"
          alt=""
          width={1920}
          height={600}
          className="pointer-events-none w-full select-none object-cover"
        />

        {/* Content overlay */}
        <div className="absolute inset-0">
          <Reveal direction="fade" className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 py-16 lg:px-6 lg:py-20">
            {/* Title with paw icon */}
            <h2 className="flex items-center gap-3 font-bubbles text-[clamp(2.5rem,5vw,4rem)] font-bold text-slate-900">
              How it Works
              <span className="text-[clamp(2.5rem,5vw,4rem)]">🐾</span>
            </h2>

            {/* Description text */}
            <p className="mt-6 max-w-4xl text-center font-bubbles text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-slate-800">
              We turn confusing scientific data into a simple, exciting activity
              that any child can to discover whether an animal is at risk of
              Mathematical Extinction.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

