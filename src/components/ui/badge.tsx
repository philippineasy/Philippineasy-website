import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        relax:
          "border-transparent bg-teal-100 text-teal-800",
        balanced:
          "border-transparent bg-emerald-100 text-emerald-800",
        adventure:
          "border-transparent bg-amber-100 text-amber-800",
        express:
          "border-transparent bg-blue-100 text-blue-800",
        premium:
          "border-transparent bg-yellow-100 text-yellow-800",
        conciergerie:
          "border-transparent bg-purple-100 text-purple-800",
        recommended:
          "border-transparent bg-accent/15 text-primary font-bold",
        success:
          "border-transparent bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
