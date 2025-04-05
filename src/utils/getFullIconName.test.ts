import { describe, expect, it } from 'vitest'
import { getFullIconName } from './getFullIconName'

// filepath: /home/alex/repos/iconify-catalog/src/utils/getFullIconName.test.ts

describe('getFullIconName', () => {
  it('should concatenate prefix and name with a colon separator', () => {
    const result = getFullIconName('icon', 'home')
    expect(result).toBe('icon:home')
  })

  it('should handle an empty prefix', () => {
    const result = getFullIconName('', 'home')
    expect(result).toBe(':home')
  })

  it('should handle an empty name', () => {
    const result = getFullIconName('icon', '')
    expect(result).toBe('icon:')
  })

  it('should handle both prefix and name being empty', () => {
    const result = getFullIconName('', '')
    expect(result).toBe(':')
  })

  it('should handle special characters in prefix and name', () => {
    const result = getFullIconName('icon$', 'home@123')
    expect(result).toBe('icon$:home@123')
  })
})
