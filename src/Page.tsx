type Props = {
  content: string;
};

const Page = ({ content }: Props) => {
  return (
    <div
      className="break-inside-avoid-column break-before-column break-after-column px-7"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Page;
