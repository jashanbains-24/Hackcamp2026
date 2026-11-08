import { useState } from 'react'
import { ArrowLeft, MoreHorizontal, Send, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink, EmptyPanel, Footnote, Pane, StatusLabel } from '@/components/neighbourgrid'
import { Button, Input, Textarea } from '@/components/ui'
import { communityCatalog, currentUserId, getAuthorName, getMembership, postKindLabel, useCommunityFeed, useCommunityState, usePost } from '@/services/communities'

export function CommunityPostPage() {
  const { slug, id } = useParams()
  const navigate = useNavigate()
  const community = communityCatalog.find((item) => item.slug === slug)
  const { post, comments, editPost, deletePost } = usePost(id)
  const { state } = useCommunityState()
  const { addComment } = useCommunityFeed(post?.communityId)
  const [comment, setComment] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(post?.title ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [error, setError] = useState('')

  if (!community || !post || post.communityId !== community.id) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <EmptyPanel icon={MoreHorizontal} title="Post not found" description="This post may have been removed or belongs to another community." />
      </div>
    )
  }

  const canWrite = getMembership(community.id, state.memberships)?.status === 'approved'
  const saveEdit = () => {
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.')
      return
    }

    editPost(title.trim(), body.trim())
    setEditing(false)
    setError('')
  }

  const submitComment = () => {
    if (!comment.trim()) return
    try {
      addComment(post.id, comment.trim())
      setComment('')
      setError('')
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Comment could not be added.')
    }
  }
  const removePost = () => {
    if (!window.confirm('Delete this post? This also removes its comments.')) return
    deletePost()
    navigate(`/app/communities/${community.slug}`)
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <BackLink to={`/app/communities/${community.slug}`}>
        <ArrowLeft className="size-4" aria-hidden />
        {community.name}
      </BackLink>
      <Pane className="ng-pane-in mt-3 p-4 sm:p-6">
        <article>
          {editing ? (
            <div className="grid gap-3">
              <label className="grid gap-1.5 text-sm font-semibold">Title<Input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
              <label className="grid gap-1.5 text-sm font-semibold">Post body<Textarea rows={6} value={body} onChange={(event) => setBody(event.target.value)} /></label>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveEdit}>Save changes</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="ng-type-display text-foreground">{post.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {postKindLabel(post.kind)} · {getAuthorName(post.authorId)} · {new Date(post.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-foreground/85">{post.body}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <StatusLabel tone="demo">Community-reported · unverified</StatusLabel>
                {post.authorId === currentUserId && (
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={removePost}><Trash2 className="size-4" aria-hidden />Delete</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </article>
      </Pane>

      <section className="mt-5" aria-labelledby="comments-title">
        <h2 id="comments-title" className="ng-type-title-sm mb-2.5 px-2 text-foreground">
          Comments <span className="text-muted-foreground">{comments.length}</span>
        </h2>
        {comments.length > 0 && (
          <Pane className="ng-pane-in ng-pane-in-delay-1 ng-row-divide overflow-hidden">
            {comments.map((item) => (
              <div key={item.id} className="px-4 py-3.5">
                <p className="text-sm leading-6 text-foreground">{item.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{getAuthorName(item.authorId)} · {new Date(item.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</p>
              </div>
            ))}
          </Pane>
        )}
        {canWrite ? (
          <div className="mt-3">
            <label htmlFor="comment" className="sr-only">Add a comment</label>
            <div className="flex items-end gap-2">
              <Textarea id="comment" rows={2} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment" />
              <Button size="icon" aria-label="Post comment" onClick={submitComment} disabled={!comment.trim()}><Send className="size-4" aria-hidden /></Button>
            </div>
            {error && !editing && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
          </div>
        ) : (
          <Footnote className="mt-3 text-left">Approved members can comment.</Footnote>
        )}
      </section>
    </div>
  )
}

export default CommunityPostPage
