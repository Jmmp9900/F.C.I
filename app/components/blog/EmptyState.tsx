import type { ReactNode } from "react";

type Props = {
  title: string;
  hint?: string;
  action?: ReactNode;
};

export function EmptyState({ title, hint, action }: Props) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-serif text-2xl text-fci-foreground">{title}</p>
      {hint ? <p className="mt-3 text-sm text-fci-muted">{hint}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
