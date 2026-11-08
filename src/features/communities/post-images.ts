export const maxPostImages = 5

export function appendPostImages(current: string[], incoming: string[]) {
  const room = Math.max(0, maxPostImages - current.length)
  return {
    images: [...current, ...incoming.slice(0, room)],
    limited: incoming.length > room,
  }
}

export async function compressPostImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const maxEdge = 1280
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Could not read that picture.')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.72)
}
