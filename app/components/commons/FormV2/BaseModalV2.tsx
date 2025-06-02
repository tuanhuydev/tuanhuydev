"use client";

import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { Modal, Paper, IconButton, Typography, Fade, Backdrop } from "@mui/material";
import React, { memo } from "react";

export interface BaseModalV2Props {
  open: boolean;
  title?: string;
  closable?: boolean;
  className?: string;
  onClose: () => void;
  prefix?: React.ReactNode;
  children?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const BaseModalV2 = memo(function BaseModalV2({
  open,
  closable = true,
  title,
  children,
  onClose,
  className = "",
  prefix,
  maxWidth = "sm",
}: BaseModalV2Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}>
      <Fade in={open} timeout={300}>
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            maxWidth: maxWidth
              ? `${
                  maxWidth === "xs"
                    ? "320px"
                    : maxWidth === "sm"
                    ? "640px"
                    : maxWidth === "md"
                    ? "768px"
                    : maxWidth === "lg"
                    ? "1024px"
                    : "1280px"
                }`
              : "none",
            width: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: "0.5rem",
            p: 3,
            "&:focus": {
              outline: "none",
            },
          }}
          className={className}>
          {/* Header */}
          {(title || closable || prefix) && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {prefix && <div>{prefix}</div>}
                {title && (
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      margin: 0,
                    }}>
                    {title}
                  </Typography>
                )}
              </div>
              {closable && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    color: "rgb(107 114 128)",
                    "&:hover": {
                      backgroundColor: "rgb(243 244 246)",
                    },
                  }}>
                  <CloseOutlined fontSize="small" />
                </IconButton>
              )}
            </div>
          )}

          {/* Content */}
          {children && <div>{children}</div>}
        </Paper>
      </Fade>
    </Modal>
  );
});

export default BaseModalV2;
