import { Link } from "@remix-run/react";

type BackButtonProps = {
  to: string;
  ariaLabel: string;
};

export default function BackButton({ to, ariaLabel }: BackButtonProps) {
  return (
    <Link
      title={ariaLabel}
      className=" p-2  -ml-1 inline-block hover:bg-gray-100 rounded-full"
      to={to}
    >
      {/* left arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>

      <span className="sr-only">{ariaLabel}</span>
    </Link>
  );
}
