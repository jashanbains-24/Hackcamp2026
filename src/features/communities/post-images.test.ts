import { describe, expect, it } from 'vitest'
import { appendPostImages } from './post-images'

describe('post images', () => {
  it('keeps at most five pictures and reports when the rest are left out', () => {
    const first = appendPostImages([], ['a', 'b', 'c'])
    expect(first).toEqual({ images: ['a', 'b', 'c'], limited: false })

    const second = appendPostImages(first.images, ['d', 'e', 'f'])
    expect(second).toEqual({ images: ['a', 'b', 'c', 'd', 'e'], limited: true })
    expect(appendPostImages(second.images, ['g']).images).toEqual(second.images)
  })
})
