import { Link } from 'react-router-dom'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { getAuthorName, postKindLabel } from '@/services/communities'
import type { Post } from '@/shared/types'

export function PostCard({ post, slug, commentCount }: { post: Post; slug: string; commentCount: number }) {
  return (
    <article className="ng-glass">
      <Link
        to={`/app/communities/${slug}/posts/${post.id}`}
        className="group flex items-start gap-3 rounded-[inherit] p-4 transition hover:bg-foreground/4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35 sm:p-5"
      >
        <span className="min-w-0 flex-1">
          <h2 className="ng-type-title-sm text-foreground group-hover:text-primary-ink">{post.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>{postKindLabel(post.kind)}</span>
            <span aria-hidden>·</span>
            <span>{getAuthorName(post.authorId)}</span>
            <span aria-hidden>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" aria-hidden />
              {commentCount}
            </span>
          </span>
        </span>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </article>
  )
}
