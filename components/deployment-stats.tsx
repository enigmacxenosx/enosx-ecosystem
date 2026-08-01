import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Deployment {
  id: number
  status: string
  environment: string
  deployedAt: Date | null
}

export default function DeploymentStats({ deployments }: { deployments: Deployment[] }) {
  const successful = deployments.filter((d) => d.status === 'success').length
  const failed = deployments.filter((d) => d.status === 'failed').length
  const pending = deployments.filter((d) => d.status === 'pending').length

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Deployment Stats</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Successful</span>
          </div>
          <span className="font-bold text-foreground">{successful}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-muted-foreground">Failed</span>
          </div>
          <span className="font-bold text-foreground">{failed}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <span className="font-bold text-foreground">{pending}</span>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">Total Deployments: {deployments.length}</p>
      </div>
    </div>
  )
}
