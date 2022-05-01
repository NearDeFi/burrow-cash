import { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { ButtonProps, MenuItemProps } from "@mui/material";

import { useClaimAllRewards } from "../../hooks";

interface Props {
  Button: React.ComponentType<LoadingButtonProps | ButtonProps | MenuItemProps>;
  location: string;
  onDone?: () => void;
}

function ClaimAllRewards({ Button, location, onDone }: Props) {
  const { handleClaimAll, isLoading } = useClaimAllRewards(location);

  const loading = Button.name === "ClaimMenuItem" ? undefined : isLoading;

  const handleClick = () => {
    handleClaimAll();
    if (onDone) onDone();
  };

  return <Button onClick={handleClick} loading={loading} />;
}

export default ClaimAllRewards;
