export const colors = {
  primary: "#47C880",
  secondary: "#000741",
  background: "#F8F9FF",
  grey: "#D0D0D0",
  dark: "#000741",
};

export const typography = {};

export const Heading6 = ({ cellData = "" }) => {
  return (
    <div style={{ color: colors.secondary, fontSize: "12px", fontWeight: 500 }}>{cellData}</div>
  );
};

export const Heading4 = ({ cellData = "" }) => {
  return (
    <div style={{ color: colors.secondary, fontSize: "14px", fontWeight: 700 }}>{cellData}</div>
  );
};
