import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Home } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-apex-dark text-center px-4">
      <div className="text-8xl font-black text-apex-amber mb-4">404</div>
      <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-apex-muted mb-8">This page doesn't exist or was moved.</p>
      <Link to="/dashboard">
        <Button leftIcon={<Home size={16} />}>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
