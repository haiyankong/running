import { Link } from 'react-router-dom';
import useSiteMetadata from '@/hooks/useSiteMetadata';
import { useRef, useCallback, useState } from 'react';
import CyclingText, { CyclingTextHandle } from '@/components/CyclingText';

const Header = () => {
  const { navLinks } = useSiteMetadata();
  const runRef = useRef<CyclingTextHandle>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    runRef.current?.play();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line/80 bg-background/90 text-primary backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <div className="relative z-50 flex items-center">
          <Link
            to="/"
            className="group flex items-center gap-3 text-xl font-black italic text-primary sm:text-2xl"
            onMouseEnter={handleMouseEnter}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-card bg-primary text-sm text-white shadow-sm">
              W
            </span>
            <CyclingText
              ref={runRef}
              text="WORKOUT"
              className="inline-block origin-left transition-transform duration-300 group-hover:scale-105"
              hoverPlay={true}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          {navLinks.map((n, i) =>
            n.url.startsWith('/') ? (
              <Link
                key={i}
                to={n.url}
                className="rounded-card border border-line bg-white/70 px-4 py-2 text-sm font-bold text-secondary shadow-sm transition-colors duration-200 hover:border-primary/25 hover:text-primary"
              >
                {n.name}
              </Link>
            ) : (
              <a
                key={i}
                href={n.url}
                className="rounded-card border border-line bg-white/70 px-4 py-2 text-sm font-bold text-secondary shadow-sm transition-colors duration-200 hover:border-primary/25 hover:text-primary"
              >
                {n.name}
              </a>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center rounded-card border border-line bg-white/80 shadow-sm focus:outline-none md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-primary transition-all duration-300 ease-out ${isMenuOpen ? 'translate-y-1.5 rotate-45' : '-translate-y-1'}`} />
          <span className={`my-0.5 block h-0.5 w-5 bg-primary transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-5 bg-primary transition-all duration-300 ease-out ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : 'translate-y-1'}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-background/95 px-6 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {navLinks.map((n, i) =>
          n.url.startsWith('/') ? (
            <Link
              key={i}
              to={n.url}
              className="w-full rounded-card border border-line bg-white px-5 py-4 text-center text-xl font-black uppercase text-primary shadow-sm transition-colors duration-200 hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {n.name}
            </Link>
          ) : (
            <a
              key={i}
              href={n.url}
              className="w-full rounded-card border border-line bg-white px-5 py-4 text-center text-xl font-black uppercase text-primary shadow-sm transition-colors duration-200 hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {n.name}
            </a>
          )
        )}
      </div>
    </nav>
  );
};

export default Header;
