import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import styles from "./HorizontalRadio.module.css";
import { cn } from "@/lib/utils";

export interface HorizontalRadioProps {
  id?: string;
  className?: string;

  options: { label: string; value: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function HorizontalRadio(
  props: HorizontalRadioProps,
): JSX.Element {
  const [internalValue, setInternalValue] = useState<string>(
    props.defaultValue || props.options[0].value,
  );

  const isControlled = props.value !== undefined;
  const selectedValue = isControlled ? props.value : internalValue;

  const handleOptionClick = (value: string) => {
    if (!isControlled) {
      setInternalValue(value);
    }

    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <div className={cn(styles.container, props.className || "")} id={props.id}>
      {props.options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleOptionClick(option.value)}
          className={cn(
            styles.option,
            selectedValue === option.value ? styles.optionSelected : "",
          )}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
