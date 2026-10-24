import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function createIcon(path: React.ReactNode, displayName: string) {
  function Icon({ size = 16, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {path}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

/* A small built-in icon set so the library has no icon dependency. Consumers can pass any icon as a ReactNode. */
export const IconCheck = createIcon(<path d="M5 12l5 5L20 7" />, "IconCheck");
export const IconX = createIcon(<path d="M18 6L6 18M6 6l12 12" />, "IconX");
export const IconChevronDown = createIcon(<path d="M6 9l6 6 6-6" />, "IconChevronDown");
export const IconChevronUp = createIcon(<path d="M6 15l6-6 6 6" />, "IconChevronUp");
export const IconChevronLeft = createIcon(<path d="M15 6l-6 6 6 6" />, "IconChevronLeft");
export const IconChevronRight = createIcon(<path d="M9 6l6 6-6 6" />, "IconChevronRight");
export const IconSelector = createIcon(<path d="M8 9l4-4 4 4M8 15l4 4 4-4" />, "IconSelector");
export const IconSearch = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </>,
  "IconSearch",
);
export const IconEye = createIcon(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  "IconEye",
);
export const IconEyeOff = createIcon(
  <>
    <path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-3.2 4.2M6.6 6.6A17 17 0 002 12s3.5 7 10 7a10.7 10.7 0 004.4-.9" />
  </>,
  "IconEyeOff",
);
export const IconInfo = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01M11 12h1v4h1" />
  </>,
  "IconInfo",
);
export const IconAlertTriangle = createIcon(
  <>
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </>,
  "IconAlertTriangle",
);
export const IconCircleCheck = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </>,
  "IconCircleCheck",
);
export const IconCircleX = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </>,
  "IconCircleX",
);
export const IconArrowUp = createIcon(<path d="M12 19V5M5 12l7-7 7 7" />, "IconArrowUp");
export const IconArrowDown = createIcon(<path d="M12 5v14M19 12l-7 7-7-7" />, "IconArrowDown");
export const IconPlus = createIcon(<path d="M12 5v14M5 12h14" />, "IconPlus");
export const IconInbox = createIcon(
  <>
    <path d="M4 13l2.5-8h11L20 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
    <path d="M4 13h4l1.5 3h5L16 13h4" />
  </>,
  "IconInbox",
);
export const IconDots = createIcon(
  <>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </>,
  "IconDots",
);
