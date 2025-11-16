import { describe, it, expect } from 'vitest'
import {
  formatViews,
  formatDuration,
  formatFileSize,
  formatDate,
  formatRelativeTime,
} from '../format'

describe('format', () => {
  describe('formatViews', () => {
    it('1000未満の数値をそのまま返す', () => {
      expect(formatViews(999)).toBe('999')
      expect(formatViews(0)).toBe('0')
    })

    it('1000以上1000000未満の数値をK形式で返す', () => {
      expect(formatViews(1000)).toBe('1.0K')
      expect(formatViews(1500)).toBe('1.5K')
      expect(formatViews(999999)).toBe('999.9K')
    })

    it('1000000以上の数値をM形式で返す', () => {
      expect(formatViews(1000000)).toBe('1.0M')
      expect(formatViews(1500000)).toBe('1.5M')
      expect(formatViews(2500000)).toBe('2.5M')
    })
  })

  describe('formatDuration', () => {
    it('undefinedの場合は空文字を返す', () => {
      expect(formatDuration(undefined)).toBe('')
    })

    it('60秒未満の場合は分:秒形式で返す', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(30)).toBe('0:30')
      expect(formatDuration(59)).toBe('0:59')
    })

    it('60秒以上の場合は分:秒形式で返す', () => {
      expect(formatDuration(60)).toBe('1:00')
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(3599)).toBe('59:59')
    })

    it('3600秒以上の場合は時:分:秒形式で返す', () => {
      expect(formatDuration(3600)).toBe('1:00:00')
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(7323)).toBe('2:02:03')
    })
  })

  describe('formatFileSize', () => {
    it('0バイトの場合は0 Bytesを返す', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('バイト単位で返す', () => {
      expect(formatFileSize(500)).toContain('Bytes')
    })

    it('KB単位で返す', () => {
      expect(formatFileSize(1024)).toContain('KB')
      expect(formatFileSize(2048)).toContain('KB')
    })

    it('MB単位で返す', () => {
      expect(formatFileSize(1048576)).toContain('MB')
    })

    it('GB単位で返す', () => {
      expect(formatFileSize(1073741824)).toContain('GB')
    })
  })

  describe('formatDate', () => {
    it('日付文字列を日本語形式に変換', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toContain('2024')
      expect(result).toContain('1')
    })

    it('文字列形式の日付を変換', () => {
      const result = formatDate('2024-01-15')
      expect(result).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('現在時刻の場合は「たった今」を返す', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('たった今')
    })

    it('1分未満の場合は「たった今」を返す', () => {
      const date = new Date(Date.now() - 30 * 1000)
      expect(formatRelativeTime(date)).toBe('たった今')
    })

    it('1分以上1時間未満の場合は「X分前」を返す', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('30分前')
    })

    it('1時間以上24時間未満の場合は「X時間前」を返す', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2時間前')
    })

    it('24時間以上の場合は「X日前」を返す', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2日前')
    })
  })
})

