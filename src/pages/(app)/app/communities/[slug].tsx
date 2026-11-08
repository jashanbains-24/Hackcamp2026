import { useRef, useState, type ChangeEvent } from 'react'
import { ArrowLeft, ImagePlus, PenLine, X } from 'lucide-react'
import { useLocation, useParams } from 'react-router-dom'
import { BackLink, EmptyPanel, Footnote, PageIntro, Pane, StatusLabel } from '@/components/neighbourgrid'
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
import { appendPostImages, compressPostImage } from '@/features/communities/post-images'
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
  const [images, setImages] = useState<string[]>([])
  const [imageNote, setImageNote] = useState('')
  const [kind, setKind] = useState<PostKind>('discussion')
  const [error, setError] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)

  if (pathname.includes('/posts/')) return <CommunityPostPage />
  if (!community) {
    return <EmptyPanel icon={PenLine} title="Community not found" description="This community is not in the curated directory." />
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])]
    event.target.value = ''
    if (files.length === 0) return
    const encoded: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      try {
        encoded.push(await compressPostImage(file))
      } catch {
        setError('One picture could not be added.')
      }
    }
    let limited = false
    setImages((current) => {
      const next = appendPostImages(current, encoded)
      limited = next.limited
      return next.images
    })
    setImageNote(limited ? 'You can add 5 photos.' : '')
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
      createPost({
        title: title.trim(),
        body: body.trim(),
        kind,
        ...(images.length > 0 ? { images } : {}),
      })
      setTitle('')
      setBody('')
      setImages([])
      setImageNote('')
      setIsComposing(false)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Post could not be published.')
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <BackLink to="/app/communities">
        <ArrowLeft className="size-4" aria-hidden />
        Communities
      </BackLink>
      <div className="mt-3">
        <PageIntro
          title={community.name}
          description={community.municipality}
          action={
            <Button onClick={() => setIsComposing((open) => !open)} disabled={!canWrite}>
              <PenLine className="size-4" aria-hidden />
              {isComposing ? 'Close' : 'New post'}
            </Button>
          }
        />
      </div>

      {/* Provenance and membership read as one quiet line under the title. */}
      <div className="-mt-1 flex flex-wrap items-center gap-1.5 px-1">
        <StatusLabel tone="demo">Community-reported · unverified</StatusLabel>
        <CommunityMembership communityId={community.id} isHome={session.homeCommunityId === community.id} size="sm" />
      </div>
      {!canWrite && (
        <Footnote className="mt-3 text-left">Join and get approved to post or comment.</Footnote>
      )}
      {isComposing && (
        <Pane className="ng-pane-in mt-4 p-4 sm:p-5" aria-labelledby="compose-title">
          <h2 id="compose-title" className="text-base font-semibold text-foreground">New post</h2>
          <div className="mt-3 grid gap-3.5">
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
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
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Title
              <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              What would you like neighbours to know?
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={1000} rows={4} />
            </label>
            <div>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                aria-label="Add photos"
                onChange={(event) => void addPhotos(event)}
              />
              <button
                type="button"
                className="ng-press inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-semibold text-foreground"
                onClick={() => photoInput.current?.click()}
              >
                <ImagePlus className="size-4" aria-hidden />
                Photos
              </button>
              {images.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto px-3 pt-3">
                  {images.map((src, index) => (
                    <div key={`${index}-${src.slice(0, 24)}`} className="relative size-16 shrink-0">
                      <img src={src} alt="" className="size-16 rounded-xl object-cover" />
                      <button
                        type="button"
                        aria-label={`Remove photo ${index + 1}`}
                        className="absolute -top-3 -right-3 grid size-11 place-items-center"
                        onClick={() => {
                          setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
                          setImageNote('')
                        }}
                      >
                        <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
                          <X className="size-3" aria-hidden />
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {imageNote && <p className="mt-2 text-sm text-muted-foreground">{imageNote}</p>}
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button onClick={submitPost}>Publish post</Button>
          </div>
        </Pane>
      )}
      <div className="mt-4">
        {posts.length > 0 ? (
          <div className="ng-stagger space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} slug={community.slug} commentCount={commentsFor(post.id).length} />
            ))}
          </div>
        ) : (
          <EmptyPanel icon={PenLine} title="No posts yet" description="Start the first conversation." />
        )}
      </div>
      <Footnote className="mt-4">
        {currentUserId === 'demo-user-maya' ? 'Maya' : 'Demo profile'} · DEMO data stays in this browser.
      </Footnote>
    </div>
  )
}
