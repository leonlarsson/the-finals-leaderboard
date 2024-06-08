type Props = {
  message: JSX.Element;
  icon: JSX.Element;
};
export default ({ icon, message }: Props) => (
  <div className="my-1 flex items-center gap-2 rounded-md bg-brand-purple p-1 text-white">
    <span className="chil *:size-5 *:flex-shrink-0">{icon}</span>
    {message}
  </div>
);
