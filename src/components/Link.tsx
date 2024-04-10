const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a href={href} target="_blank" className="w-fit font-medium hover:underline">
    {children}
  </a>
);

export default Link;
