import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { StatusLabel } from '@/components/neighbourgrid'
import { getAuthorName, postKindLabel } from '@/services/communities'
import type { Post } from '@/shared/types'

export function PostCard({ post, slug, commentCount }: { post: Post; slug: string; commentCount: number }) {
  return (
    <article className="border-b border-border py-5 first:border-t">
      <div className="flex flex-wrap items-center gap-2">
        <StatusLabel tone="neutral">{postKindLabel(post.kind)}</StatusLabel>
        <StatusLabel tone="demo">Community-reported · not verified</StatusLabel>
      </div>
      <Link
        to={`/app/communities/${slug}/posts/${post.id}`}
        className="group mt-3 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h2 className="ng-type-title-sm text-foreground group-hover:text-primary-ink">{post.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
      </Link>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{getAuthorName(post.authorId)}</span>
        <span aria-hidden>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString('en-CA')}</span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="size-3.5" aria-hidden />
          {commentCount}
        </span>
      </div>
    </article>
  )
}
