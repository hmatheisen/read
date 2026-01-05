type Props = {
  content: string;
};

const Page = ({ content }: Props) => {
  // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
  return <div style={{ breakBefore: "column" }} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Page;
