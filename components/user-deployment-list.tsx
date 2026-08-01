import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react'

interface Deployment {
  id: number
  repositoryId: number
  status: string
  environment: string
  url: string | null
  commitSha: string | null
  deployedAt: Date | null
  createdAt: Date
}

export default function UserDeploymentList({ deployments }: { deployments: Deployment[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-600'
      case 'failed':
        return 'bg-red-500/10 text-red-600'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600'
      default:
        return 'bg-gray-500/10 text-gray-600'
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">My Deployments</h2>

      <div className="space-y-3">
        {deployments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No deployments yet</p>
        ) : (
          deployments.map((deployment) => (
            <div key={deployment.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.status)}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {deployment.environment}
                    </p>
                    {deployment.commitSha && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {deployment.commitSha.substring(0, 7)}
                      </p>
                    )}
                    {deployment.deployedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(deployment.deployedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                {deployment.url && (
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
