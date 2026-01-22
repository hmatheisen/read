type Props = {
  text: string;
};

const Header = ({ text }: Props) => {
  return (
    <div className="h-(--header-height) text-gray-400 text-xs flex items-center justify-center">
      <span>{text}</span>
    </div>
  );
};

export default Header;
