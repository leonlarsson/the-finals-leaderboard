import Link from "./Link";

type LinkifyProps = {
  text: string;
};

export const Linkify = ({ text }: LinkifyProps) => {
  const parts = text.split(/\[([^\]]+)]\(([^)]+)\)/);

  const elements = parts.map((part, index) => {
    if (index % 3 === 1) {
      // This is the link text
      return (
        <Link key={index} href={parts[index + 1]}>
          {part}
        </Link>
      );
    } else if (index % 3 === 2) {
      // This is the link URL, ignore
      return null;
    } else {
      // This is regular text
      return part;
    }
  });

  return <span>{elements}</span>;
};
