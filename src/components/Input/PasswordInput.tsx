import { forwardRef, useState } from "react";
import { IconEye, IconEyeOff } from "@/icons";
import { IconButton } from "@/components/IconButton/IconButton";
import { TextInput, type TextInputProps } from "./TextInput";

export type PasswordInputProps = Omit<TextInputProps, "type" | "rightSection" | "rightSectionInteractive">;

/** Text input with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ size = "md", ...rest }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextInput
      ref={ref}
      size={size}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      rightSectionInteractive
      rightSection={
        <IconButton
          size="sm"
          label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          icon={visible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        />
      }
      {...rest}
    />
  );
});
