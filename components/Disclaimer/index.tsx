import {
  Modal,
  Typography,
  Link,
  List,
  ListItem,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { useDisclaimer } from "../../hooks/useDisclaimer";

import { trackConnectWallet } from "../../utils/telemetry";
import { CloseButton } from "../Modal/components";

export default function Disclaimer({ isOpen = false, onClose }) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const { setDisclaimer } = useDisclaimer();

  const handleAgree = () => {
    trackConnectWallet();
    onClose();
    setDisclaimer(true);
    window.modal.show();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        bgcolor="white"
        p="2rem"
        m="2rem"
        borderRadius="0.5rem"
        width={{ small: "100%", md: "460px" }}
        position="relative"
        color="#444444"
        sx={{
          display: "flex",
          flexDirection: "column",
          mx: "auto",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        <CloseButton onClose={onClose} />
        <Typography variant="h5" component="h5" color="black">
          Disclaimer
        </Typography>
        <Box sx={{ overflow: "scroll" }}>
          <FormControlLabel
            control={
              <Checkbox sx={{ mt: 1 }} checked={checked1} onClick={() => setChecked1(!checked1)} />
            }
            sx={{ display: "flex", alignItems: "flex-start" }}
            label={
              <Typography mt="1rem" fontSize="0.75rem">
                I have read and understood the{" "}
                <Link href="https://docs.burrow.cash/product-docs/disclaimer" target="_blank">
                  Declaration and Disclaimers
                </Link>
                , that such understanding is irrevocable and will apply to all of my uses of the
                Site without me providing confirmation in each specific instance.
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox sx={{ mt: 1 }} checked={checked2} onClick={() => setChecked2(!checked2)} />
            }
            sx={{ display: "flex", alignItems: "flex-start" }}
            label={
              <Typography mt="1rem" fontSize="0.75rem">
                I acknowledge and agree that the Site solely provides information about data on the{" "}
                <Link href="https://near.org" target="_blank">
                  NEAR blockchain
                </Link>
                . I accept that the Site has no operators and that no operator has custody over my
                funds, ability or duty to transact on my behalf or power to reverse my transactions.
                The Site affirmers do not endorse or provide any warranty with respect to any
                tokens.
              </Typography>
            }
          />

          <Typography fontSize="0.875rem" fontWeight="300" mt="1rem">
            In addition you acknowledge that;
          </Typography>
          <List
            dense
            sx={{
              listStyleType: "disc",
              pl: 2,
              "& .MuiListItem-root": {
                display: "list-item",
                p: 0,
              },
            }}
          >
            <ListItem>
              <Typography fontSize="0.625rem">
                I am not a person or company who is a resident of, is located, incorporated, or has
                a registered agent in, the United States of America or a Restricted Territory as
                defined in the Declaration and Disclaimers;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography fontSize="0.625rem">
                I will not in the future access this site while located in the United States of
                America or a Restricted Territory;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography fontSize="0.625rem">
                I am not using, and will not in the future use, a virtual private network or other
                means to mask my physical location from a Restricted Territory;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography fontSize="0.625rem">
                I am lawfully permitted to access this site under the laws of the jurisdiction in
                which I reside and am located;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography fontSize="0.625rem">
                I understand the risks associated with blockchain technology and trading in digital
                assets.
              </Typography>
            </ListItem>
          </List>
        </Box>
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Button
            variant="contained"
            sx={{ mx: "2rem", my: "1rem" }}
            disabled={!checked1 || !checked2}
            onClick={handleAgree}
          >
            Agree & Confirm
          </Button>
          <Typography
            fontSize="0.625rem"
            textAlign="center"
            mx="4rem"
            color="rgba(68, 68, 68, 0.6)"
          >
            By clicking this button you acknowledge and agree to all statements in this disclaimer.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
