export const splitArrayInChunks = (items: any[], size: number) => {
    const chunks: any[] = []
    items = [].concat(...items)

    while (items.length) {
      chunks.push(
        items.splice(0, size)
      )
    }

    return chunks
  }
