"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "group bg-background text-foreground-secondary dark:data-[state=unchecked]:bg-foreground dark:data-[state=unchecked]:text-background dark:data-[state=checked]:bg-primary-foreground dark:data-[state=checked]:text-primary pointer-events-none flex size-4 items-center justify-center rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:text-primary data-[state=unchecked]:translate-x-0"
        )}
      >
        <Check aria-hidden className="size-2.5 group-data-[state=unchecked]:hidden" strokeWidth={3} />
        <X aria-hidden className="size-2.5 group-data-[state=checked]:hidden" strokeWidth={3} />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
