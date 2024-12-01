import { Link } from "@remix-run/react";

type BackButtonProps = {
  to: string;
  ariaLabel: string;
};

export default function BackButton({ to, ariaLabel }: BackButtonProps) {
  return (
    <Link title={ariaLabel} className="hover:bg-gray-100 p-2 -ml-2" to={to}>
      {/* back icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
        />
      </svg>

      <span className="sr-only">{ariaLabel}</span>
    </Link>
  );
}
