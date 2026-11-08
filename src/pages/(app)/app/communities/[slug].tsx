import { useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Button, useToast } from '@/components/ui'
import { BackLink, EmptyPanel } from '@/components/neighbourgrid'
import { communities, demoPosts, postAuthors } from '@/shared/demo-data'

export default function CommunityPreviewPage() {
  const { slug } = useParams()
  const { info } = useToast()
  const community = communities.find((item) => item.slug === slug) ?? communities[0]

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app/communities">
        <ArrowLeft className="size-4" aria-hidden />
        Communities
      </BackLink>

      <div className="mt-4 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="ng-type-display text-foreground">{community.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{community.municipality}</p>
        </div>
        <Button
          className="hidden sm:inline-flex"
          onClick={() =>
            info('Posts arrive in the next build', 'Person B owns publishing and membership.')
          }
        >
          New post
        </Button>
      </div>

      {community.slug === 'newton' ? (
        <ul className="divide-y divide-border">
          {demoPosts.map((post) => (
            <li key={post.id} className="py-4">
              <p className="ng-type-meta text-muted-foreground">
                {post.kind === 'resource_offer' ? 'Resource offer' : 'Discussion'}
                {' · '}
                {postAuthors[post.authorId]}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{post.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pt-6">
          <EmptyPanel
            icon={MessageCircle}
            title="No conversations yet"
            description="Feeds for this community arrive in the next build."
            action={
              <Button
                variant="outline"
                onClick={() =>
                  info('Posts arrive in the next build', 'Person B owns publishing and membership.')
                }
              >
                Preview compose
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}
