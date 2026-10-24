import { forwardRef } from "react";
import { IconSearch, IconX } from "@/icons";
import { IconButton } from "@/components/IconButton/IconButton";
import { TextInput, type TextInputProps } from "./TextInput";

export interface SearchInputProps extends Omit<
  TextInputProps,
  | "type"
  | "leftSection"
  | "rightSection"
  | "rightSectionInteractive"
  | "value"
  | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

/** Controlled search field with a search icon and a clear button once there is text. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onChange, placeholder = "Search", label, ...rest },
    ref,
  ) {
    return (
      <TextInput
        ref={ref}
        type="search"
        label={label}
        aria-label={label ? undefined : placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSectionInteractive
        rightSection={
          value ? (
            <IconButton
              size="sm"
              label="Clear search"
              icon={<IconX size={16} />}
              onClick={() => onChange("")}
            />
          ) : undefined
        }
        {...rest}
      />
    );
  },
);
