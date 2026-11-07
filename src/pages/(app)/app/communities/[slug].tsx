import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Plus } from 'lucide-react'
import { Badge, Button, useToast } from '@/components/ui'
import { Card } from '@/components/neighbourgrid'
import { communities, demoPosts, postAuthors } from '@/shared/demo-data'

export default function CommunityPreviewPage() {
  const { slug } = useParams()
  const { info } = useToast()
  const community = communities.find((item) => item.slug === slug) ?? communities[0]

  return (
    <div className="mx-auto max-w-[820px] px-4 py-7 sm:px-6">
      <Link to="/app/communities" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" aria-hidden />
        All communities
      </Link>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <Badge className="bg-primary/10 text-primary">Demo community</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{community.name}</h1>
          <p className="mt-1 text-muted-foreground">{community.municipality} · {community.description}</p>
        </div>
        <Button
          className="hidden sm:inline-flex"
          onClick={() => info('Posts arrive in the next build', 'Person B owns publishing and membership.')}
        >
          <Plus /> New post
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {community.slug === 'newton' ? demoPosts.map((post) => (
          <Card key={post.id} className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{post.kind === 'resource_offer' ? 'Resource offer' : 'Discussion'}</Badge>
              <span className="text-xs text-muted-foreground">Community-reported · demo</span>
            </div>
            <h2 className="mt-4 text-lg font-bold">{post.title}</h2>
            <p className="mt-2 leading-6 text-muted-foreground">{post.body}</p>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
              <span>{postAuthors[post.authorId]}</span>
              <span className="inline-flex items-center gap-1.5"><MessageCircle className="size-4" /> Preview thread</span>
            </div>
          </Card>
        )) : (
          <Card className="p-8 text-center">
            <MessageCircle className="mx-auto size-6 text-primary" />
            <h2 className="mt-4 font-bold">No demo conversations here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Seeded community feeds arrive in the next build.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
