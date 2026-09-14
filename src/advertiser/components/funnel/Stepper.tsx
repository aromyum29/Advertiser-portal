/**
 * Progress through the booking. Completed steps are links back; steps ahead
 * are inert, because jumping forward past an unanswered question is how people
 * end up paying for something they did not choose.
 */
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Step, StepId } from "../../state/funnel";

export function Stepper({ steps, current }: { steps: readonly Step[]; current: StepId }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol
      aria-label={`Step ${currentIndex + 1} of ${steps.length}`}
      className="flex flex-shrink-0 flex-wrap items-center gap-2.5"
    >
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const marker = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold",
                active || done
                  ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-[13px]",
                active ? "font-bold" : "font-semibold text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <li key={step.id} className="flex items-center gap-2.5">
            {done ? (
              <Link
                to={step.path}
                className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                {marker}
                <span className="sr-only">, completed. Go back to this step.</span>
              </Link>
            ) : (
              <span className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
                {marker}
              </span>
            )}
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="h-[1.5px] w-6 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
