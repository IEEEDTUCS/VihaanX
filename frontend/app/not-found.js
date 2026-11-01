export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b19] text-white">
      <h1 className="font-tech text-6xl font-black text-[#ff3b6c]">404</h1>
      <p className="mt-4 font-mono text-sm tracking-widest text-white/70">
        LOST IN DEEP SPACE // ORBIT NOT FOUND
      </p>
      <a
        href="/"
        className="mt-6 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 font-mono text-xs tracking-wider text-white hover:bg-white hover:text-black transition-all"
      >
        RETURN TO BASE // HOME
      </a>
    </div>
  );
}
