import { Link } from 'react-router-dom'
import { ChevronRight, Megaphone, MessageCircle, Package, UserRound } from 'lucide-react'
import { PostGallery } from '@/components/communities/PostGallery'
import { getAuthorName, postKindLabel } from '@/services/communities'
import type { Post, PostKind } from '@/shared/types'

const kindStyle: Record<PostKind, { icon: typeof MessageCircle; pill: string }> = {
  discussion: { icon: MessageCircle, pill: 'bg-primary/15 text-primary-ink' },
  resource_offer: { icon: Package, pill: 'bg-success/15 text-success' },
  local_update: { icon: Megaphone, pill: 'bg-info/15 text-info' },
}

export function PostCard({ post, slug, commentCount }: { post: Post; slug: string; commentCount: number }) {
  const kind = kindStyle[post.kind]
  const KindIcon = kind.icon
  const posted = new Date(post.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

  const images = post.images ?? []

  return (
    <article className="ng-glass p-4 sm:p-5">
      <Link
        to={`/app/communities/${slug}/posts/${post.id}`}
        className="group block rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
      >
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${kind.pill}`}>
          <KindIcon className="size-3.5" aria-hidden />
          {postKindLabel(post.kind)}
        </span>

        <span className="mt-3 flex items-start gap-3">
          <h2 className="min-w-0 flex-1 text-2xl font-bold leading-[1.15] tracking-tight text-foreground group-hover:text-primary-ink">
            {post.title}
          </h2>
          <ChevronRight className="mt-1.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        </span>

        <p className="mt-2 line-clamp-3 text-base leading-6 text-muted-foreground">{post.body}</p>
      </Link>

      {images.length > 0 && (
        <div className="mt-3">
          <PostGallery images={images} />
        </div>
      )}

      <Link
        to={`/app/communities/${slug}/posts/${post.id}`}
        className="mt-4 flex min-w-0 items-center gap-2.5 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
      >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground/10 text-muted-foreground">
            <UserRound className="size-4" aria-hidden />
          </span>
          <span className="truncate font-semibold text-foreground">{getAuthorName(post.authorId)}</span>
          <span className="h-4 w-px shrink-0 bg-foreground/15" aria-hidden />
          <span className="shrink-0 text-muted-foreground">{posted}</span>
          <span className="h-4 w-px shrink-0 bg-foreground/15" aria-hidden />
          <span className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="size-4" aria-hidden />
            <span className="sr-only">{commentCount} comments</span>
            <span aria-hidden>{commentCount}</span>
          </span>
      </Link>
    </article>
  )
}
