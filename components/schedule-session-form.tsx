"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSessions } from "./session-context"

// Get today's date for validation
const today = new Date()
today.setHours(0, 0, 0, 0)

// Define the form schema with Zod
const formSchema = z.object({
  dateTime: z
    .date({
      required_error: "Date and time are required",
    })
    .refine((date) => date >= today, {
      message: "Date must be today or in the future",
    }),
  duration: z.string().min(1, "Duration is required"),
  topic: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ScheduleSessionFormProps {
  partnerId: string
  partnerName: string
  language: string
}

export function ScheduleSessionForm({ partnerId, partnerName, language }: ScheduleSessionFormProps) {
  const router = useRouter()
  const { addSession } = useSessions()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: "30",
      topic: "",
      notes: "",
    },
  })

  function handleDateSelect(date: Date | undefined, field: any) {
    if (date) {
      // Preserve the time if already set
      const currentValue = field.value
      if (currentValue) {
        date.setHours(currentValue.getHours(), currentValue.getMinutes(), 0, 0)
      }
      field.onChange(date)
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string, field: any) {
    const currentDate = field.value || new Date()
    const newDate = new Date(currentDate)

    if (type === "hour") {
      const hour = Number.parseInt(value, 10)
      const isPM = newDate.getHours() >= 12
      newDate.setHours(isPM ? hour + 12 : hour)
    } else if (type === "minute") {
      newDate.setMinutes(Number.parseInt(value, 10))
    } else if (type === "ampm") {
      const hours = newDate.getHours()
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12)
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12)
      }
    }

    field.onChange(newDate)
  }

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    // Create a new session object
    const newSession = {
      partnerName,
      date: values.dateTime.toISOString(),
      duration: Number.parseInt(values.duration),
      language,
      topic: values.topic || `${language} practice session`,
      notes: values.notes || undefined,
    }

    // Add the session to the context
    addSession(newSession)

    // Show success toast with Sonner
    toast.success("Session scheduled successfully", {
      description: `Your ${language} session with ${partnerName} has been scheduled.`,
      duration: 5000,
    })

    // Redirect to sessions page after a short delay
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/sessions")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Session with {partnerName}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "MM/dd/yyyy hh:mm aa") : <span>Select date and time</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => handleDateSelect(date, field)}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value && field.value.getHours() % 12 === hour % 12 ? "default" : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => handleTimeChange("hour", hour.toString(), field)}
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={field.value && field.value.getMinutes() === minute ? "default" : "ghost"}
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("minute", minute.toString(), field)}
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    ((ampm === "AM" && field.value.getHours() < 12) ||
                                      (ampm === "PM" && field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("ampm", ampm, field)}
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select your preferred date and time for the session.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What would you like to practice?" {...field} />
                  </FormControl>
                  <FormDescription>Specify what you'd like to focus on during this session.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes for this session" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

