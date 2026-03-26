import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  company: string
  text: string
  rating: number
  date: Date
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{review.company}</CardTitle>
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{review.text}</p>
      </CardContent>
    </Card>
  )
}
