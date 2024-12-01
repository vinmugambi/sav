import { Link } from "@remix-run/react";

export default function LogoLink() {
  return (
    <Link
      to="/home"
      className="p-1 text-2xl font-bold font-serif text-gray-800 hover:bg-gray-50 "
    >
      GramAlly
    </Link>
  );
}
