"use client";

import { Button, Modal, Typography } from "@mui/material";
import React from "react";

export default function Page() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div className="absolute -top-1/2 -left-1/2 translate-x-1/2 translate-y-1/2 w-400 bg-white border-2 border-black rounded-md shadow-lg p-4">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </div>
      </Modal>
    </>
  );
}
