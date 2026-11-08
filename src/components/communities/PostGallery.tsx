import { useRef, useState } from 'react'

export function PostGallery({ images }: { images: string[] }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  function readIndex() {
    const element = scroller.current
    if (!element || element.clientWidth === 0) return
    setIndex(Math.min(images.length - 1, Math.max(0, Math.round(element.scrollLeft / element.clientWidth))))
  }

  function show(next: number) {
    const element = scroller.current
    if (!element) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollTo({ left: next * element.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Post photos"
        onScroll={readIndex}
      >
        {images.map((src, imageIndex) => (
          <img
            key={`${imageIndex}-${src.slice(0, 32)}`}
            src={src}
            alt={`Photo ${imageIndex + 1} of ${images.length}`}
            draggable={false}
            className="aspect-square w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-center">
          {images.map((_, imageIndex) => (
            <button
              key={imageIndex}
              type="button"
              aria-label={`Photo ${imageIndex + 1}`}
              aria-current={imageIndex === index ? 'true' : undefined}
              className="grid size-11 place-items-center"
              onClick={() => show(imageIndex)}
            >
              <span
                className={`size-1.5 rounded-full ${imageIndex === index ? 'bg-foreground' : 'bg-foreground/30'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
