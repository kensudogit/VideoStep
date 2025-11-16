import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isStrongPassword,
  isValidUrl,
  isValidVideoFile,
  isValidFileSize,
} from '../validation'

describe('validation', () => {
  describe('isValidEmail', () => {
    it('有効なメールアドレスを正しく検証', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.co.jp')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('無効なメールアドレスを正しく検証', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isStrongPassword', () => {
    it('強力なパスワードを正しく検証', () => {
      expect(isStrongPassword('Password123')).toBe(true)
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true)
      expect(isStrongPassword('StrongPass1')).toBe(true)
    })

    it('弱いパスワードを正しく検証', () => {
      expect(isStrongPassword('short')).toBe(false) // 8文字未満
      expect(isStrongPassword('lowercase123')).toBe(false) // 大文字なし
      expect(isStrongPassword('UPPERCASE123')).toBe(false) // 小文字なし
      expect(isStrongPassword('NoNumbers')).toBe(false) // 数字なし
      expect(isStrongPassword('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('有効なURLを正しく検証', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true)
    })

    it('無効なURLを正しく検証', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('isValidVideoFile', () => {
    it('有効な動画ファイルを正しく検証', () => {
      const mp4File = new File([''], 'test.mp4', { type: 'video/mp4' })
      const webmFile = new File([''], 'test.webm', { type: 'video/webm' })
      const oggFile = new File([''], 'test.ogg', { type: 'video/ogg' })
      const quicktimeFile = new File([''], 'test.mov', { type: 'video/quicktime' })

      expect(isValidVideoFile(mp4File)).toBe(true)
      expect(isValidVideoFile(webmFile)).toBe(true)
      expect(isValidVideoFile(oggFile)).toBe(true)
      expect(isValidVideoFile(quicktimeFile)).toBe(true)
    })

    it('無効なファイルタイプを正しく検証', () => {
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const textFile = new File([''], 'test.txt', { type: 'text/plain' })

      expect(isValidVideoFile(imageFile)).toBe(false)
      expect(isValidVideoFile(textFile)).toBe(false)
    })
  })

  describe('isValidFileSize', () => {
    it('有効なファイルサイズを正しく検証', () => {
      const file = new File(['x'.repeat(1024 * 1024)], 'test.mp4', { type: 'video/mp4' }) // 1MB
      expect(isValidFileSize(file, 10)).toBe(true) // 10MB制限
    })

    it('制限を超えるファイルサイズを正しく検証', () => {
      const file = new File(['x'.repeat(11 * 1024 * 1024)], 'test.mp4', { type: 'video/mp4' }) // 11MB
      expect(isValidFileSize(file, 10)).toBe(false) // 10MB制限
    })

    it('制限と同じファイルサイズを正しく検証', () => {
      const file = new File(['x'.repeat(10 * 1024 * 1024)], 'test.mp4', { type: 'video/mp4' }) // 10MB
      expect(isValidFileSize(file, 10)).toBe(true) // 10MB制限
    })
  })
})

