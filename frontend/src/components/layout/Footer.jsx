const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-0 w-full px-10 flex justify-between items-center text-slate-500 text-xs font-medium tracking-wide uppercase opacity-60">
      <div>© 2026 Analytics Corp.</div>
      <div className="flex gap-6">
        <a className="hover:text-primary transition-colors" href="#">Privacy</a>
        <a className="hover:text-primary transition-colors" href="#">Terms</a>
        <a className="hover:text-primary transition-colors" href="#">Security</a>
      </div>
    </footer>
  );
};

export default Footer;