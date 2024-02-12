interface Props {
  message: string | JSX.Element;
}

const StatusBar = ({ message }: Props) => (
  <div className="border-primary rounded flex justify-center w-full py-2.5 px-4 mt-4 font-extrabold">
    {message}
  </div>
);

export default StatusBar;
