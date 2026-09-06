export function Paw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="15.8" rx="5.2" ry="4.2" />
      <ellipse cx="5.4" cy="10.6" rx="2.1" ry="2.9" transform="rotate(-18 5.4 10.6)" />
      <ellipse cx="18.6" cy="10.6" rx="2.1" ry="2.9" transform="rotate(18 18.6 10.6)" />
      <ellipse cx="9.1" cy="6.6" rx="2.1" ry="2.9" transform="rotate(-8 9.1 6.6)" />
      <ellipse cx="14.9" cy="6.6" rx="2.1" ry="2.9" transform="rotate(8 14.9 6.6)" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 8.4L22 12l-8.4 1.6L12 22l-1.6-8.4L2 12l8.4-1.6L12 2z" />
    </svg>
  );
}

export function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21s-8.5-5.5-10-10C1 7 3 4 6.5 4c2.3 0 4.2 1.3 5.5 3.2C13.3 5.3 15.2 4 17.5 4 21 4 23 7 22 11c-1.5 4.5-10 10-10 10z" />
    </svg>
  );
}

export function Balloon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="9" rx="6.5" ry="7.5" />
      <path d="M10.6 16.6h2.8l-1.4 2z" />
      <path
        d="M12 18.8c-.6 1.4 1.4 2 .6 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Bowtie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M10.7 12L2.5 6.8c-.7-.4-1.5.1-1.5.9v8.6c0 .8.8 1.3 1.5.9L10.7 12z" />
      <path d="M13.3 12l8.2-5.2c.7-.4 1.5.1 1.5.9v8.6c0 .8-.8 1.3-1.5.9L13.3 12z" />
      <ellipse cx="12" cy="12" rx="2.4" ry="2" />
    </svg>
  );
}

export function Envelope({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Calendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M8 3v4M16 3v4" strokeLinecap="round" />
      <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2M14.5 16.5h2" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

export function Megaphone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3 10.2v3.6c0 .7.5 1.2 1.2 1.2h2L16 19.4c.8.4 1.7-.2 1.7-1.1V5.7c0-.9-.9-1.5-1.7-1.1l-9.8 4.4h-2c-.7 0-1.2.5-1.2 1.2z" />
      <path d="M5.5 15.5h3L7.3 20c-.2.6-.8 1-1.4.8-.6-.2-.9-.8-.8-1.4l.4-3.9z" />
      <path d="M20 9.5a3.5 3.5 0 010 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 28" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M8 14h40" strokeLinecap="round" />
      <path d="M72 14h40" strokeLinecap="round" />
      <path d="M52 14c3-8 13-8 16 0M52 14c3 8 13 8 16 0" strokeLinecap="round" />
      <path d="M56 5c2-3 6-3 8 0M56 23c2 3 6 3 8 0" strokeLinecap="round" />
    </svg>
  );
}
