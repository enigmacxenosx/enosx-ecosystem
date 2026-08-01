import { Activity } from 'lucide-react'

interface LogEntry {
  id: number
  userId: string
  action: string
  entityType: string
  entityId: string
  changes: string | null
  createdAt: Date
}

export default function AuditLog({ logs }: { logs: LogEntry[] }) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-600'
      case 'update':
        return 'bg-blue-500/10 text-blue-600'
      case 'delete':
        return 'bg-red-500/10 text-red-600'
      default:
        return 'bg-gray-500/10 text-gray-600'
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
        <Activity className="w-5 h-5" />
        <span>Audit Log</span>
      </h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No audit logs</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border border-border rounded p-3 flex items-start space-x-3 hover:bg-secondary transition">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                {log.action.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.entityType}</span> {log.entityId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
