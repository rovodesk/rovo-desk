import * as React from "react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { toast } from "../ui/toast"

/* -------------------------------------------------------------------------- */
/* Contexts (store unknown, restore generics in hooks)                         */
/* -------------------------------------------------------------------------- */

import { formContext as FormContext, fieldContext as FieldContext } from "./form-context"

 function useFormContext<TForm>() {
  const ctx = React.useContext(FormContext as any)
  if (!ctx) {
    throw new Error("useFormContext must be used inside <form.MultiStep>")
  }
  return ctx as TForm
}

 function useFieldContext<TValue>() {
  const ctx = React.useContext(FieldContext as any)
  if (!ctx) {
    throw new Error("useFieldContext must be used inside <form.Field>")
  }
  return ctx as TValue
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type StepConfig<TValues> = {
  id: string
  title?: string
  shouldShow?: (values: TValues) => boolean
  validate?: (values: TValues) => boolean | Promise<boolean>
  onNext?: (values: TValues) => void | Promise<void>
  onPrevious?: (values: TValues) => void | Promise<void>
}

type StepRuntimeHandlers = {
  onNext?: () => void | Promise<void>
  onPrevious?: () => void | Promise<void>
}

type MultiStepContextValue<TValues> = {
  values: TValues
  stepId: string
  currentStep: StepConfig<TValues>
  index: number
  totalSteps: number
  progress: number // Percentage 0-100
  isFirst: boolean
  isLast: boolean
  steps: readonly StepConfig<TValues>[]
  next(): Promise<void>
  previous(): Promise<void>
  goTo(id: string): void
  registerHandlers(h: StepRuntimeHandlers): void
}

const MultiStepContext =
  React.createContext<MultiStepContextValue<any> | null>(null)

function useMultiStep<TValues extends Record<string, unknown>>() {
  const ctx = React.useContext(MultiStepContext)
  if (!ctx) {
    throw new Error("useMultiStep must be used inside <form.MultiStep>")
  }
  return ctx as MultiStepContextValue<TValues>
}

/* -------------------------------------------------------------------------- */
/* <form.MultiStep />                                                         */
/* -------------------------------------------------------------------------- */

function MultiStep<TValues extends Record<string, unknown>>({
  form,
  steps,
  children,
  onComplete,
  className,
}: {
  form: {
    state: { values: TValues }
    handleSubmit(): Promise<void>
  }
  steps: readonly StepConfig<TValues>[]
  children: ReactNode
  onComplete?: (values: TValues) => void | Promise<void>
  className?: string
}) {
  const [index, setIndex] = React.useState(0)
  const handlersRef = React.useRef<StepRuntimeHandlers>({})

  // Subscribe to form state to ensure re-renders on value changes
  const values = (form as any).useStore((s: any) => s.values) as TValues

  const visibleSteps = React.useMemo(
    () => steps.filter(s => !s.shouldShow || s.shouldShow(values)),
    [steps, values]
  )

  const step = visibleSteps[index]
  
  // Sync index if visible steps change and current index is now out of bounds
  React.useEffect(() => {
    if (index >= visibleSteps.length && visibleSteps.length > 0) {
      setIndex(visibleSteps.length - 1)
    }
  }, [visibleSteps.length, index])

  if (!step) {
    if (visibleSteps.length > 0) {
        return null; // Content will sync in useEffect
    }
    throw new Error(`No visible steps found`)
  }

  const next = async () => {
    console.log("MultiStep: Next called", { index, stepId: step.id })
    try {
      if (step.validate) {
        const valid = await step.validate(values)
        if (!valid) {
          toast.error("Please complete the current step before moving forward")
          return
        }
      }

      await step.onNext?.(values)
      await handlersRef.current.onNext?.()

      if (index === visibleSteps.length - 1) {
        await form.handleSubmit()
        await onComplete?.(values)
        return
      }

      handlersRef.current = {}
      setIndex(i => i + 1)
    } catch (error) {
      console.error("Error during next step transition:", error)
    }
  }

  const previous = async () => {
    console.log("MultiStep: Previous called", { index })
    try {
      await step.onPrevious?.(values)
      await handlersRef.current.onPrevious?.()

      handlersRef.current = {}
      setIndex(i => Math.max(0, i - 1))
    } catch (error) {
      console.error("Error during previous step transition:", error)
    }
  }

 const ctx: MultiStepContextValue<TValues> = {
  values,
  stepId: step.id,
  currentStep: step,
  index,
  totalSteps: visibleSteps.length,
  progress: Math.round(((index + 1) / visibleSteps.length) * 100),
  isFirst: index === 0,
  isLast: index === visibleSteps.length - 1,
    steps: visibleSteps,
    next,
    previous,
    goTo: id => {
      console.log("MultiStep: GoTo called", id)
      setIndex(visibleSteps.findIndex(s => s.id === id))
    },
    registerHandlers: h => {
      handlersRef.current = h
    },
  }

  return (
    <FormContext.Provider value={form as any}>
      <MultiStepContext.Provider value={ctx}>
        <div className={className}>{children}</div>
      </MultiStepContext.Provider>
    </FormContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* <form.Step />                                                              */
/* -------------------------------------------------------------------------- */

function Step<TValues extends Record<string, unknown>>({
  id,
  children,
  onNext,
  onPrevious,
}: {
  id: string
  children: ReactNode
  onNext?: () => void | Promise<void>
  onPrevious?: () => void | Promise<void>
}) {
  const { stepId, registerHandlers } = useMultiStep<TValues>()

  React.useEffect(() => {
    if (stepId === id) {
      registerHandlers({ onNext, onPrevious })
    }
  }, [onNext, onPrevious, registerHandlers, stepId, id])

  if (stepId !== id) return null
  return <>{children}</>
}

/* -------------------------------------------------------------------------- */
/* <form.Field />                                                             */
/* -------------------------------------------------------------------------- */

function Field<TValues extends Record<string, unknown>>({
  name,
  validators,
  children,
}: {
  name: keyof TValues
  validators?: unknown
  children: ReactNode
}) {
  const form = useFormContext<any>()

  return (
    <form.Field name={name as string} validators={validators}>
      {(field: any) => (
        <FieldContext.Provider value={field as any}>
          {children}
        </FieldContext.Provider>
      )}
    </form.Field>
  )
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

function Navigation() {
  const { next, previous, isFirst, isLast } = useMultiStep<Record<string, unknown>>()

  return (
    <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
      <Button 
        type="button" 
        variant="outline" 
        disabled={isFirst} 
        onClick={previous}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <Button 
        type="button" 
        onClick={next}
        className="gap-2 min-w-[100px]"
      >
        {isLast ? (
          <>
            Complete
            <Check className="h-4 w-4" />
          </>
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Step Indicator                                                             */
/* -------------------------------------------------------------------------- */

function StepIndicator() {
  const { index, totalSteps, goTo, steps } = useMultiStep<any>()

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => i <= index && steps[i] && goTo(steps[i]!.id)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === index 
              ? "w-8 bg-primary" 
              : i < index 
                ? "w-2 bg-primary/40 hover:bg-primary/60" 
                : "w-2 bg-muted hover:bg-muted-foreground/20"
          )}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  )
}

function ProgressBar() {
  const { progress } = useMultiStep()
  return (
    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-8">
      <div 
        className="bg-primary h-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  )
}

function StepHeader() {
  const { currentStep, index, totalSteps } = useMultiStep()
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Step {index + 1} of {totalSteps}
      </p>
      <h1 className="text-2xl font-bold">{currentStep.title ?? currentStep.id}</h1>
    </div>
  )
}

export const form = {
  MultiStep,
  Step,
  Field,
  Navigation,
  StepIndicator,
  ProgressBar,
  StepHeader,
  useMultiStep,
  useFieldContext,
  useFormContext,
} as const;

export type { StepConfig };