import { Link } from "@remix-run/react";

export default function LogoLink() {
  return (
    <Link
      to="/home"
      className="p-0.5 text-2xl font-bold font-serif text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
    >
      GramAlly
    </Link>
  );
}
