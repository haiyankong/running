import useSiteMetadata from '@/hooks/useSiteMetadata';

const Footer = () => {
  const { siteTitle } = useSiteMetadata();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 w-full border-t border-line/80 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1480px] items-center gap-4 text-xs font-bold uppercase text-secondary">
        <span>© {year} {siteTitle}</span>
      </div>
    </footer>
  );
};

export default Footer;
