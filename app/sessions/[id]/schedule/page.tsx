import { ScheduleSessionForm } from "@/components/schedule-session-form"

// Mock partner data
const partners = {
  "1": {
    id: "1",
    name: "Maria Rodriguez",
    language: "Spanish",
  },
  "2": {
    id: "2",
    name: "Hiroshi Tanaka",
    language: "Japanese",
  },
  "3": {
    id: "3",
    name: "Sophie Dubois",
    language: "French",
  },
  "4": {
    id: "4",
    name: "Li Wei",
    language: "Mandarin",
  },
}

export default function ScheduleSessionPage({ params }: { params: { id: string } }) {
  const id = params.id
  const partner = partners[id as keyof typeof partners] || partners["1"]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Schedule a Session</h1>
        <ScheduleSessionForm partnerId={partner.id} partnerName={partner.name} language={partner.language} />
      </div>
    </div>
  )
}

