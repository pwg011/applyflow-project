import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type SurfacePanelProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function SurfacePanel<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: SurfacePanelProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={`border border-white/90 bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
