import { describe, expect, it } from 'vitest'
import { createRankedGroups } from './createRankedGroups'

describe('createRankedGroups', () => {
  it('should return an empty array for empty input', () => {
    const items: string[] = []
    const result = createRankedGroups(items)
    expect(result).toEqual([])
  })

  it('should handle inputs with fewer tokens than the maximum group size', () => {
    const items = ['icon']
    const result = createRankedGroups(items)
    expect(result).toContainEqual(['icon', 1]) // Single token with length 1
    expect(result).toHaveLength(1)
  })

  it('should return only the top 20 ranked groups', () => {
    const items = Array.from({ length: 25 }, (_, i) => `group-${i}`)
    const result = createRankedGroups(items)
    expect(result).toHaveLength(20) // Limited to top 20
  })

  it('should return the correct ranking for groups with different lengths', () => {
    const items = [
      'a-b-c',
      'a-b',
      'a',
    ]

    const result = createRankedGroups(items)

    expect(result).toEqual([
      ['a-b', 10],
      ['a-b-c', 8],
      ['b-c', 5],
      ['a', 3],
      ['b', 2],
      ['c', 1],
    ])
  })

  it('should return the correct ranking for complex groups with different lengths', () => {
    const items = [
      'a-b-c-d',
      'b-c-d-e',
      'c-d-e-f',
      'a-c-d-c',
      'a-b-c',
      'a-b',
      'a',
    ]

    const result = createRankedGroups(items)

    expect(result).toEqual([
      ['c-d', 20],
      ['a-b-c', 16],
      ['b-c-d', 16],
      ['c-d-e', 16],
      ['a-b', 15],
      ['b-c', 15],
      ['a-b-c-d', 10],
      ['b-c-d-e', 10],
      ['a-c-d-c', 10],
      ['d-e', 10],
      ['d-e-f', 8],
      ['a-c-d', 8],
      ['c-d-c', 8],
      ['c', 6],
      ['e-f', 5],
      ['a-c', 5],
      ['d-c', 5],
      ['a', 5],
      ['b', 4],
      ['d', 4],
    ])
  })
})
