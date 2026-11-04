export function Avatar() {
  return (
    <figure className="avatar">
      <svg viewBox="0 0 160 160" role="img" aria-label="면접관">
        <rect width="160" height="160" rx="16" className="avatar-bg" />
        <path d="M30 160c4-34 24-50 50-50s46 16 50 50z" className="avatar-shirt" />
        <path d="M68 108h24l-12 20z" className="avatar-collar" />
        <circle cx="80" cy="70" r="30" className="avatar-skin" />
        <path d="M48 66c0-24 14-38 32-38s34 12 34 36c-8-10-20-16-34-16s-24 6-32 18z" className="avatar-hair" />
        <circle cx="70" cy="72" r="3" className="avatar-eye" />
        <circle cx="90" cy="72" r="3" className="avatar-eye" />
        <path d="M71 86c5 4 13 4 18 0" className="avatar-mouth" />
      </svg>
      <figcaption>면접관</figcaption>
    </figure>
  );
}
