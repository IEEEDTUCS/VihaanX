function Icon({ name }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'instagram') {
    return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>;
  }

  if (name === 'linkedin') {
    return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6M8 8v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" /></svg>;
  }

  if (name === 'whatsapp') {
    return <svg {...common}><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.8 2.5 2.3l.5-.5c.2-.2.4-.2.6-.1l1.4.7c.3.1.4.3.3.6-.2.8-.8 1.3-1.6 1.3-2.4 0-4.7-2.5-5.7-4.1-.7-1.2-1-2.2-.7-2.8Z" /></svg>;
  }

  if (name === 'registration') {
    return <svg {...common}><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></svg>;
  }

  return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" /></svg>;
}

export default function Linktree({ linktree }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,.18),transparent_35%),#0a0a0f] px-3 py-4 font-body text-[#f0f0f0] sm:px-5 sm:py-8">
      <section className="w-full max-w-[35rem] rounded-[1.3rem] border border-white/10 bg-[#13131f]/90 p-5 text-center shadow-[0_1.5rem_4rem_rgba(0,0,0,.35)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:p-[1.4rem]" aria-labelledby="linktree-title">
        <a href="/" className="mx-auto mb-4 block w-[min(11rem,64%)]" aria-label="Back to Vihaan X home">
          <img src="/logos/whiteieee.png" alt="IEEE DTU" width="182" height="102" />
        </a>

        {linktree.eventLogo && (
          <img className="mx-auto mb-3 w-[2048px] h-auto object-contain drop-shadow-[0_0_1.2rem_rgba(124,58,237,.3)]" src={linktree.eventLogo} alt={`${linktree.title} logo`} width="112" height="112" />
        )}

        {/*<h1 id="linktree-title" className="my-2 font-display text-[clamp(1.7rem,5vw,2.35rem)] font-bold leading-tight text-white">{linktree.title}</h1>*/}
        {linktree.description && <p className="mx-auto max-w-[29rem] text-[.95rem] leading-6 text-[#8a8a9a]">{linktree.description}</p>}

        <nav className="mt-6 grid gap-3" aria-label={`${linktree.title} links`}>
          {linktree.links.map((link) => {
            const external = /^https?:\/\//.test(link.href);
            return (
              <a
                className="grid min-h-[3.55rem] grid-cols-[1.5rem_1fr_1.5rem] items-center gap-2 rounded-[.9rem] border border-white/10 bg-white/[.045] px-4 py-3 text-left text-[.88rem] font-semibold transition hover:-translate-y-0.5 hover:border-violet-700 hover:bg-violet-600 hover:shadow-[0_.6rem_1.4rem_rgba(124,58,237,.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f5b335] sm:text-[.95rem]"
                href={link.href}
                key={`${link.label}-${link.href}`}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Icon name={link.icon} />
                <span className="text-center">{link.label}</span>
                <span className="justify-self-end text-xl" aria-hidden="true">↗</span>
              </a>
            );
          })}
        </nav>

        <p className="mt-5 font-mono text-[.68rem] leading-5 text-[#505068]">IEEE DTU Student Branch · Delhi Technological University</p>
      </section>
    </main>
  );
}
