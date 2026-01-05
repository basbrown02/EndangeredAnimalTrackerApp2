import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";

// Social media icon components
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full">
      {/* Top Section with Background Image */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
          <Image
            src="/footer-group5.png"
            alt="Footer background with animals"
            fill
            className="object-cover object-center"
            quality={100}
            priority
            sizes="100vw"
          />
          
          {/* Downloads Section Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 pb-20 pt-8 md:gap-10 md:pb-24">
            {/* Main Text */}
            <h2
              className="text-center text-4xl font-normal leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ fontFamily: "var(--font-fuzzy-bubbles)" }}
            >
              Let's learn to save the planet!
            </h2>

            {/* App Store Buttons - 60% larger */}
            <div className="flex items-center justify-center">
              <Image
                src="/downloads.png"
                alt="Download on the App Store, Google Play, and Amazon Appstore"
                width={3602}
                height={413}
                className="h-auto w-full max-w-[960px] px-4 md:max-w-[1440px] lg:max-w-[1760px] xl:max-w-[2240px]"
                quality={100}
                priority
                sizes="(max-width: 640px) 960px, (max-width: 768px) 1440px, (max-width: 1024px) 1760px, 2240px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blue Footer Section */}
      <div className="bg-[#1B3A6B] py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col items-start gap-6">
            {/* Follow us section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Follow us</h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B3A6B] transition-transform hover:scale-110"
                  aria-label="Follow us on X (Twitter)"
                >
                  <XIcon />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B3A6B] transition-transform hover:scale-110"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B3A6B] transition-transform hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B3A6B] transition-transform hover:scale-110"
                  aria-label="Follow us on YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B3A6B] transition-transform hover:scale-110"
                  aria-label="Follow us on TikTok"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/20" />

            {/* Copyright and links */}
            <div className="flex w-full flex-col items-center gap-2 text-center text-sm md:flex-row md:justify-center md:gap-4">
              <span>© 2025 Bands of Courage</span>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:underline">
                Terms of use
              </a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:underline">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


