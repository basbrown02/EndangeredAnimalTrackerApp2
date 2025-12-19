import Image from "next/image";

type Props = {
  isAuthed: boolean;
};

export const HeroSection = ({ isAuthed }: Props) => {
  return (
    <section className="w-full bg-[#F9F7F0]">
      {/* Lock the hero artwork to a consistent 2:1 ratio so all overlay sizing stays proportional */}
      <div className="relative w-full overflow-hidden bg-[#F9F7F0] [aspect-ratio:2/1] min-h-[520px] lg:min-h-[680px]">
        <Image
          src="/hero-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none select-none object-cover object-bottom"
        />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl flex-col px-4 pt-10 lg:px-6 lg:pt-14">
            <h1 className="font-bubbles text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.06] text-slate-900">
              <span className="typewriter">The Endangered Animal Tracker</span>
            </h1>

            <div className="mt-[clamp(3.25rem,8vw,6.5rem)] grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="max-w-[540px]">
                <p className="font-bubbles text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-slate-900">
                  Make the world sustainable, today.
                </p>
                <p className="mt-3 max-w-[520px] font-bubbles text-[clamp(1rem,1.6vw,1.125rem)] leading-snug text-slate-800/90">
                  Driven to make the world sustainable, today.
                  <br className="hidden sm:block" />
                  because we've lost <span className="font-bold">73%</span> of our wildlife in the last
                  50 years.
                </p>

                <div className="mt-6">
                  <Image
                    src="/downloads.png"
                    alt="Download on App Store, Google Play, and Amazon Appstore"
                    width={600}
                    height={60}
                    quality={100}
                    className="h-auto w-full max-w-[520px]"
                    priority
                  />
                </div>

                {!isAuthed && (
                  <div className="mt-8">
                    <a
                      href="#start"
                      className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
                    >
                      Sign up / Sign in
                    </a>
                  </div>
                )}
              </div>

              {/* Spacer column to preserve layout on large screens */}
              <div className="hidden lg:block" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
