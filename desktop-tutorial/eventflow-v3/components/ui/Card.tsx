import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, style, hover }: CardProps) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
