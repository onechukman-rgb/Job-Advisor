"use client"

import { useEffect, useState } from "react"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"
import { Header } from "@/components/header"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { Empty } from "@/components/ui/empty"
import { FileText } from "lucide-react"

interface Review {
  id: string
  company: string
  text: string
  rating: number
  date: Date
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)
      const reviewsData: Review[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        reviewsData.push({
          id: doc.id,
          company: data.company,
          text: data.text,
          rating: parseInt(data.rating),
          date: data.date?.toDate() || new Date(),
        })
      })

      setReviews(reviewsData)
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleAddReview = async (data: { company: string; text: string; rating: number }) => {
    await addDoc(collection(db, "reviews"), {
      ...data,
      date: new Date(),
      userId: user?.uid,
    })
    await loadReviews()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Trova aziende e leggi recensioni</h2>

        <div className="space-y-4 mb-8">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Caricamento...</div>
          ) : reviews.length === 0 ? (
            <Empty
              icon={FileText}
              title="Nessuna recensione"
              description="Sii il primo a scrivere una recensione!"
            />
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>

        <ReviewForm onSubmit={handleAddReview} disabled={!user} />

        {!user && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Effettua il login per pubblicare una recensione
          </p>
        )}
      </main>
    </div>
  )
}
