type Props = {
  content: string;
};

const Page = ({ content }: Props) => {
  return <div style={{ breakBefore: "column" }} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Page;
