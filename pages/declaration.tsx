import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function TermsPage({ content }) {
  const plugins = [remarkGfm];
  return (
    <Box mx={{ xs: "2rem", md: "4rem" }}>
      <ReactMarkdown remarkPlugins={plugins}>{content}</ReactMarkdown>
    </Box>
  );
}

export async function getStaticProps() {
  const content = await fetch(
    "https://raw.githubusercontent.com/NearDeFi/burrow-cash/main/DECLARATION.md",
  ).then((r) => r.text());
  return {
    props: { content },
  };
}

export default TermsPage;
