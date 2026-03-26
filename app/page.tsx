"use client"

import { useEffect, useState } from "react"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore"
import { getFirebaseAuth, getFirebaseDb, googleProvider, isFirebaseConfigured } from "@/lib/firebase"
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
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    setFirebaseReady(isFirebaseConfigured())
  }, [])

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

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
    const auth = getFirebaseAuth()
    if (!auth) return

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleLogout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleAddReview = async (data: { company: string; text: string; rating: number }) => {
    const db = getFirebaseDb()
    if (!db || !user) return

    await addDoc(collection(db, "reviews"), {
      ...data,
      date: new Date(),
      userId: user.uid,
    })
    await loadReviews()
  }

  if (!firebaseReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-lg mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Configurazione Firebase Richiesta</h1>
          <p className="text-muted-foreground mb-6">
            Per utilizzare JobAdvisor, devi configurare le variabili d&apos;ambiente Firebase.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm">
            <p className="font-semibold mb-2">Aggiungi queste variabili in Settings {">"} Vars:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
              <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Trova questi valori nella Firebase Console sotto Project Settings {">"} General {">"} Your apps
          </p>
        </div>
      </div>
    )
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
