import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import styles from "./HorizontalRadio.module.css";
import { cn } from "@/lib/utils";

export interface HorizontalRadioProps {
  id?: string;
  className?: string;

  options: { label: string; value: string }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function HorizontalRadio(
  props: HorizontalRadioProps,
): JSX.Element {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.defaultValue || props.options[0].value,
  );

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);

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
