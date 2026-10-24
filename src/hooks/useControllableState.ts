import { useCallback, useState } from "react";

interface Options<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/** State that works both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`). */
export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set];
}
