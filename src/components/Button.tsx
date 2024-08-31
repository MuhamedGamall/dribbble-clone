"use client";
import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = {
  title: string;
  leftIcon?: string | null;
  rightIcon?: string | null;
  handleClick?: MouseEventHandler;
  submitting?: boolean | false;
  type?: "button" | "submit";
  bgColor?: string;
  textColor?: string;
  iconWidth?: number;

  className?: string;
};

const Button = ({
  title,
  leftIcon,
  rightIcon,
  handleClick,
  submitting,
  type,
  iconWidth,
  className,
  bgColor,
  textColor,
}: Props) => (
  <button
    type={type || "button"}
    disabled={submitting || false}
    className={`flexCenter gap-3 text-[15px] px-4 py-3 
        ${textColor ? textColor : "text-white"} 
        ${
          submitting
            ? " bg-primary-purple/50"
            : bgColor
            ? bgColor
            : "bg-primary-purple"
        } rounded-[5px] text-sm font-medium md:w-full ${className}`}
    onClick={handleClick}
  >
    {leftIcon && (
      <Image
        loading="lazy"
        src={leftIcon}
        width={iconWidth || 14}
        height={iconWidth || 14}
        alt="left icon"
      />
    )}
    {title}
    {rightIcon && (
      <Image
        loading="lazy"
        src={rightIcon}
        width={iconWidth || 14}
        height={iconWidth || 14}
        alt="right icon"
      />
    )}
  </button>
);

export default Button;
