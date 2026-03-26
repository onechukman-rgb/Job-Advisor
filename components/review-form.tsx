"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

interface ReviewFormProps {
  onSubmit: (data: { company: string; text: string; rating: number }) => Promise<void>
  disabled?: boolean
}

export function ReviewForm({ onSubmit, disabled }: ReviewFormProps) {
  const [company, setCompany] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company || !text || !rating) {
      alert("Compila tutti i campi")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ company, text, rating: parseInt(rating) })
      setCompany("")
      setText("")
      setRating("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrivi una recensione</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome azienda</FieldLabel>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome azienda"
                disabled={disabled || isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Voto</FieldLabel>
              <Select value={rating} onValueChange={setRating} disabled={disabled || isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un voto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Stella</SelectItem>
                  <SelectItem value="2">2 Stelle</SelectItem>
                  <SelectItem value="3">3 Stelle</SelectItem>
                  <SelectItem value="4">4 Stelle</SelectItem>
                  <SelectItem value="5">5 Stelle</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>{"Com'è lavorare qui?"}</FieldLabel>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Scrivi la tua esperienza..."
                rows={4}
                disabled={disabled || isSubmitting}
              />
            </Field>

            <Button type="submit" disabled={disabled || isSubmitting} className="w-full">
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              Pubblica
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
