export default function Avatar({ name }: { name: string }) {
  const initials = getInitials(name);
  return (
    <div className="relative inline-flex items-center justify-center size-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {initials}
      </span>
    </div>
  );
}

function getInitials(name: string): string {
  // Split the name into words
  const words = name.split(" ");
  // Extract the first letter of the first and last words, fallback to just the first letter
  return words.length > 1
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : words[0][0].toUpperCase();
}
