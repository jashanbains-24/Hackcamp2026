import { useState } from 'react'
import { ArrowLeft, PenLine } from 'lucide-react'
import { useLocation, useParams } from 'react-router-dom'
import { BackLink, EmptyPanel, PageIntro, StatusLabel } from '@/components/neighbourgrid'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { CommunityMembership } from '@/components/communities/CommunityMembership'
import { PostCard } from '@/components/communities/PostCard'
import {
  communityCatalog,
  currentUserId,
  getMembership,
  useCommunityFeed,
  useCommunityState,
} from '@/services/communities'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'
import type { PostKind } from '@/shared/types'
import { CommunityPostPage } from './[slug]/posts/[id]'

export default function CommunityPage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const community = communityCatalog.find((item) => item.slug === slug)
  const session = useNeighbourGridSession()
  const { state } = useCommunityState()
  const { posts, commentsFor, createPost } = useCommunityFeed(community?.id)
  const [isComposing, setIsComposing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [kind, setKind] = useState<PostKind>('discussion')
  const [error, setError] = useState('')

  if (pathname.includes('/posts/')) return <CommunityPostPage />
  if (!community) {
    return <EmptyPanel icon={PenLine} title="Community not found" description="This community is not in the curated directory." />
  }

  const membership = getMembership(community.id, state.memberships)
  const canWrite = membership?.status === 'approved'
  const submitPost = () => {
    setError('')
    if (!title.trim() || !body.trim()) {
      setError('Add a title and a short description before publishing.')
      return
    }
    try {
      createPost({ title: title.trim(), body: body.trim(), kind })
      setTitle('')
      setBody('')
      setIsComposing(false)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Post could not be published.')
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app/communities">
        <ArrowLeft className="size-4" aria-hidden />
        Communities
      </BackLink>
      <PageIntro
        title={community.name}
        description={`${community.municipality} · ${community.description}`}
        action={<CommunityMembership communityId={community.id} isHome={session.homeCommunityId === community.id} />}
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
        <div>
          <StatusLabel tone="demo">Community-reported content</StatusLabel>
          <p className="mt-1 text-xs text-muted-foreground">Posts are not independently verified.</p>
        </div>
        <Button onClick={() => setIsComposing((open) => !open)} disabled={!canWrite}>
          <PenLine className="size-4" aria-hidden />
          {isComposing ? 'Close composer' : 'New post'}
        </Button>
      </div>
      {!canWrite && (
        <p className="mb-5 border-l-2 border-advisory bg-advisory/60 px-3 py-2 text-sm text-advisory-foreground">
          Join this community and wait for approval before publishing or commenting.
        </p>
      )}
      {isComposing && (
        <section className="mb-5 border border-border p-4" aria-labelledby="compose-title">
          <h2 id="compose-title" className="ng-type-title-sm text-foreground">Create a community post</h2>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium text-foreground">
              Post type
              <Select value={kind} onValueChange={(value) => setKind(value as PostKind)}>
                <SelectTrigger aria-label="Post type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="local_update">Local update</SelectItem>
                  <SelectItem value="resource_offer">Resource offer</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-foreground">
              Title
              <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-foreground">
              What would you like neighbours to know?
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={1000} rows={5} />
            </label>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button onClick={submitPost}>Publish post</Button>
          </div>
        </section>
      )}
      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} slug={community.slug} commentCount={commentsFor(post.id).length} />
          ))}
        </div>
      ) : (
        <EmptyPanel icon={PenLine} title="No posts yet" description="Be the first neighbour to start a conversation." />
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        Signed in as {currentUserId === 'demo-user-maya' ? 'Maya' : 'your demo profile'} · demo data stays in this browser.
      </p>
    </div>
  )
}
