import { ExternalLink, Star } from 'lucide-react'

interface Repo {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number | null
  syncedAt: Date
}

export default function RepositoryList({ repositories }: { repositories: Repo[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Repositories</h2>

      <div className="space-y-3">
        {repositories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No repositories found</p>
        ) : (
          repositories.map((repo) => (
            <div key={repo.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-primary hover:underline flex items-center space-x-2"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    {repo.language && <span>{repo.language}</span>}
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stars || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
