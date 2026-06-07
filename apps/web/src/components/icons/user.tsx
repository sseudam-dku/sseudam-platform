export function IconUser({ className, filled }: { className?: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.9 -1.2 3.5 -2.9 4.1a6.5 6.5 0 0 1 5.4 6.4v1h-14v-1a6.5 6.5 0 0 1 5.4 -6.4c-1.7 -0.6 -2.9 -2.2 -2.9 -4.1a4.5 4.5 0 0 1 4.5 -4.5z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}
