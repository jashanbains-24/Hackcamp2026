import { useState } from 'react'
import { ArrowLeft, MoreHorizontal, Send, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink, EmptyPanel, StatusLabel } from '@/components/neighbourgrid'
import { Button, Textarea } from '@/components/ui'
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
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to={`/app/communities/${community.slug}`}>
        <ArrowLeft className="size-4" aria-hidden />
        {community.name}
      </BackLink>
      <article className="mt-5 border-y border-border py-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusLabel>{postKindLabel(post.kind)}</StatusLabel>
          <StatusLabel tone="demo">Community-reported · not verified</StatusLabel>
        </div>
        {editing ? (
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-medium">Title<input className="h-11 rounded-lg border border-input bg-transparent px-3" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label className="grid gap-1 text-sm font-medium">Post body<Textarea rows={6} value={body} onChange={(event) => setBody(event.target.value)} /></label>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveEdit}>Save changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="ng-type-display mt-3 text-foreground">{post.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-muted-foreground">{post.body}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{getAuthorName(post.authorId)} · {new Date(post.createdAt).toLocaleDateString('en-CA')}</span>
              {post.authorId === currentUserId && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={removePost}><Trash2 className="size-4" aria-hidden />Delete</Button>
                </div>
              )}
            </div>
          </>
        )}
      </article>
      <section className="mt-6" aria-labelledby="comments-title">
        <h2 id="comments-title" className="ng-type-title-sm text-foreground">Comments ({comments.length})</h2>
        {comments.length > 0 && (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {comments.map((item) => (
              <li key={item.id} className="py-4">
                <p className="text-sm leading-6 text-foreground">{item.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{getAuthorName(item.authorId)} · {new Date(item.createdAt).toLocaleDateString('en-CA')}</p>
              </li>
            ))}
          </ul>
        )}
        {canWrite ? (
          <div className="mt-5">
            <label htmlFor="comment" className="text-sm font-medium text-foreground">Add a comment</label>
            <div className="mt-2 flex items-end gap-2">
              <Textarea id="comment" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Keep it useful and neighbourly." />
              <Button size="icon" aria-label="Post comment" onClick={submitComment} disabled={!comment.trim()}><Send className="size-4" aria-hidden /></Button>
            </div>
            {error && !editing && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">Approved members can join the conversation.</p>
        )}
      </section>
    </div>
  )
}

export default CommunityPostPage
