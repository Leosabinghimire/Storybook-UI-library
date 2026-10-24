import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Tooltip text or content. */
  content: ReactNode;
  placement?: TooltipPlacement;
  /** Delay before showing, in ms. */
  openDelay?: number;
  /** The trigger. Must be focusable (button, link, input) so keyboard users can open the tooltip. */
  children: ReactElement<TriggerProps>;
  className?: string;
}

interface TriggerProps {
  "aria-describedby"?: string;
}

/**
 * Shows extra information on hover and keyboard focus. The trigger must be focusable so keyboard users
 * can reach it; the content is linked through aria-describedby.
 */
export function Tooltip({ content, placement = "top", openDelay = 150, children, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  };

  if (!isValidElement(children)) return children;
  // Only the aria link is cloned onto the trigger; the listeners sit on the wrapper and catch the
  // trigger's bubbling mouse and focus events.
  const trigger = cloneElement(children, { "aria-describedby": open ? id : undefined });

  return (
    <span
      className={cx(styles.anchor, className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => event.key === "Escape" && hide()}
    >
      {trigger}
      {open && (
        <span role="tooltip" id={id} className={cx(styles.tooltip, styles[placement])}>
          {content}
        </span>
      )}
    </span>
  );
}
