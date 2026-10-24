// Styles: consumers import "my-ui-library/styles.css" (built) or this file's CSS during development.
import "./styles/index.css";

// Theme
export { ThemeProvider, useTheme, type Theme, type ThemePreference, type ThemeProviderProps } from "./theme/ThemeProvider";

// Actions
export { Button, type ButtonProps, type ButtonVariant } from "./components/Button/Button";
export { IconButton, type IconButtonProps } from "./components/IconButton/IconButton";
export { Dropdown, type DropdownItem, type DropdownProps } from "./components/Dropdown/Dropdown";

// Forms
export { FormField, type FormFieldProps, type FormFieldBaseProps, type FormFieldRenderProps } from "./components/FormField/FormField";
export { TextInput, type TextInputProps } from "./components/Input/TextInput";
export { PasswordInput, type PasswordInputProps } from "./components/Input/PasswordInput";
export { SearchInput, type SearchInputProps } from "./components/Input/SearchInput";
export { Textarea, type TextareaProps } from "./components/Input/Textarea";
export { Select, type SelectOption, type SelectProps } from "./components/Select/Select";
export { Checkbox, type CheckboxProps } from "./components/Checkbox/Checkbox";
export { Radio, RadioGroup, type RadioGroupProps, type RadioProps } from "./components/Radio/Radio";
export { Switch, type SwitchProps } from "./components/Switch/Switch";

// Data display
export { Badge, type BadgeProps } from "./components/Badge/Badge";
export { StatusIndicator, type Status, type StatusIndicatorProps } from "./components/StatusIndicator/StatusIndicator";
export { Card, type CardProps } from "./components/Card/Card";
export { StatCard, type StatCardProps } from "./components/StatCard/StatCard";
export { Table, sortRows, type Column, type SortDirection, type SortState, type SortValue, type TableProps } from "./components/Table/Table";
export { Pagination, type PaginationProps } from "./components/Pagination/Pagination";

// Feedback
export { Alert, type AlertProps } from "./components/Alert/Alert";
export { ToastProvider, useToast, type ToastOptions, type ToastPosition, type ToastProviderProps } from "./components/Toast/Toast";
export { Tooltip, type TooltipPlacement, type TooltipProps } from "./components/Tooltip/Tooltip";
export { Spinner, type SpinnerProps } from "./components/Spinner/Spinner";
export { Skeleton, SkeletonText, type SkeletonProps, type SkeletonTextProps } from "./components/Skeleton/Skeleton";
export { EmptyState, type EmptyStateProps } from "./components/EmptyState/EmptyState";

// Overlays
export { Modal, type ModalProps } from "./components/Modal/Modal";
export { ConfirmDialog, type ConfirmDialogProps } from "./components/Modal/ConfirmDialog";

// Navigation
export { Tabs, type TabItem, type TabsProps } from "./components/Tabs/Tabs";
export { Accordion, type AccordionItem, type AccordionProps } from "./components/Accordion/Accordion";

// Utilities
export * from "./icons";
export { cx } from "./utils/cx";
export type { Size, Tone } from "./utils/types";
