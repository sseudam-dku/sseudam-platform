export function IconChatbot({ className, filled }: { className?: string; filled?: boolean }) {
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
        <path d="M18 3a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-4.5 2.7v-2.7h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h11z" />
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
      <path d="M12 11v.01" />
      <path d="M8 11v.01" />
      <path d="M16 11v.01" />
      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3l12 0" />
    </svg>
  );
}
