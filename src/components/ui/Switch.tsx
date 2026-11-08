import { useEffect, useState } from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '@/lib/utils'

/**
 * Switch — wraps Base UI's Switch. Base UI owns the controlled/uncontrolled
 * state, keyboard/ARIA, and the hidden form input (a sibling, not illegally
 * nested inside the button). Style via the `data-[checked]` / `data-[unchecked]`
 * state attributes.
 *
 * After mount, `ng-switch-ready` enables the area-preserving knob stretch
 * (ui-animation-polish rule 5) so the first paint does not animate in.
 */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[checked]:bg-primary data-[unchecked]:bg-input',
        ready && 'ng-switch-ready',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0',
          // Before ready / under reduced motion: plain slide. After ready: CSS keyframes own transform (rule 5).
          ready
            ? 'motion-reduce:translate-x-0 motion-reduce:data-[checked]:translate-x-4 motion-reduce:transition-transform'
            : 'translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[checked]:translate-x-4',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
