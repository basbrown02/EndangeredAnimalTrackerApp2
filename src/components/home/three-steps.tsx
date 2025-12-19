import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export const ThreeStepsSection = () => {
  return (
    <section className="w-full bg-[#F9F7F0] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Step 1: Choose your animal */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <Reveal direction="left" className="flex flex-col justify-center">
            <h2 className="font-bubbles text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-slate-900">
              Choose your animal to research
            </h2>
            <p className="mt-4 font-bubbles text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-slate-800">
              Choose your favourite endangered species - a koala, turtle,
              pangolin, or any animal you love. Give it a name, add a picture,
              and begin your mission.
            </p>
          </Reveal>

          {/* Right: Animal selection */}
          <div className="flex items-center justify-center lg:justify-start">
            <Image
              src="/customanimals.png"
              alt="Select your animal - Leo, Nemo, Kong, Indi, Lucy, Nickname"
              width={1050}
              height={375}
              className="h-auto w-full max-w-[1050px]"
            />
          </div>
        </div>

        {/* Step 2: Plug findings into calculator */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Animals Lab */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <Image
              src="/animalslab.png"
              alt="Animals doing mathematical calculations at lab table"
              width={600}
              height={500}
              className="h-auto w-full max-w-[600px]"
            />
          </div>

          {/* Right: Text */}
          <Reveal direction="right" className="flex flex-col justify-center order-1 lg:order-2">
            <h2 className="font-bubbles text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-slate-900">
              Plug findings into our calculator
            </h2>
            <p className="mt-4 font-bubbles text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-slate-800">
              Fill out a series of questions to calculate whether the population
              is growing, shrinking, or nearing the Tipping Point - Mathematical
              Extinction (no complicated Science).
            </p>
          </Reveal>
        </div>

        {/* Step 3: Help save your animal */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <Reveal direction="left" className="flex flex-col justify-center">
            <h2 className="font-bubbles text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-slate-900">
              Help save your animal, plant trees and earn a certificate
            </h2>
            <p className="mt-4 font-bubbles text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-slate-800">
              Share your research with your class, see how close you are to our
              estimate and earn your certificate. Every completed project helps
              save an animal by planting 10 trees, while giving you $10 off any
              Bands Of Courage item.
              <br />
              <br />
              Kids can finish feeling informed by using maths, science, and
              real-world data to protect nature.
            </p>
          </Reveal>

          {/* Right: Certificate */}
          <div className="flex items-center justify-center lg:justify-end">
            <Image
              src="/certificate-v2.png"
              alt="Certificate of completion"
              width={500}
              height={600}
              className="h-auto w-full max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
