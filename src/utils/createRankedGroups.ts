function getValue(length: number) {
  switch (length) {
    case 1:
      return 1
    case 2:
      return 5
    case 3:
      return 8
    default:
      return 10
  }
}

const MAX_ITEMS = 20

/**
 *
 */
export function createRankedGroups(items: string[]) {
  const rankedGroups: Record<string, number> = {}

  for (let parts = 4; parts >= 1; parts--) {
    items.forEach((item) => {
      const tokens = item.split('-')

      for (let i = 0; i <= tokens.length - parts; i++) {
        const group = tokens.slice(i, i + parts).join('-')

        if (rankedGroups[group]) {
          rankedGroups[group] += getValue(parts)
        }
        else {
          rankedGroups[group] = getValue(parts)
        }
      }
    })
  }

  const rankedGroupsArray = Object.entries(rankedGroups)

  rankedGroupsArray.sort((a, b) => b[1] - a[1])

  // remove tokens that are parts of tokens with higher ranking
  // but only do this until 20 items are left
  while (rankedGroupsArray.length > MAX_ITEMS + 1) {
    const item = rankedGroupsArray.pop()

    if (!item)
      break

    const [group] = item

    // iterate over the current top MAX_ITEMS items and check if one of them includes the group
    for (let i = 0; i < MAX_ITEMS; i++) {
      const [topGroup] = rankedGroupsArray[i]

      // if the group is part of a top group, remove it
      if (topGroup.includes(group)) {
        rankedGroupsArray.splice(i, 1)
        break
      }
    }
  }

  // if there are still more than 20 items remove the remaining items
  // this is teh case when the groups all high the same ranking
  return rankedGroupsArray.slice(0, MAX_ITEMS)
}
