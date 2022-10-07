import { useEffect } from "react";

function TermsPage() {
  const getContent = async () => {
    const content = await fetch(
      "https://github.com/NearDeFi/burrow-cash/blob/main/DECLARATION.md",
    ).then((r) => r.text());
    console.info(content);
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div>
      <h1>Terms</h1>
    </div>
  );
}

export default TermsPage;
