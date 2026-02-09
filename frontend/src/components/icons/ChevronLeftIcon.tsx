type Props = { className?: string };

export const ChevronLeftIcon = ({ className }: Props) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M14.5 5.5L8 12l6.5 6.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);