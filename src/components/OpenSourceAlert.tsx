import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"

export function OpenSourceAlert() {
  return (
    <Alert variant="default" className="mb-4">
      <div className="flex gap-3">
        <AlertCircle />
        <div>
          <AlertTitle>Exciting Future Ahead!</AlertTitle>
          <AlertDescription>
            CommitKings will become open source once the platform gains enough attention!
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}