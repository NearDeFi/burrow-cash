import { Box, useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function TermsPage({ content }) {
  const plugins = [remarkGfm];
  const theme = useTheme();
  return (
    <Box mx={{ xs: "2rem", md: "4rem", color: theme.palette.secondary.main }}>
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
