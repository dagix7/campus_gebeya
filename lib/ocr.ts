import Tesseract from 'tesseract.js'
import type { OCRResult } from '@/types'

/**
 * Extract text from student ID image using Tesseract.js OCR
 * Checks for AAU or AASTU patterns in the extracted text
 *
 * @param file - Image file to process (student ID card)
 * @returns OCRResult with confidence level and matched patterns
 */
export async function extractTextFromImage(file: File): Promise<OCRResult> {
  try {
    // Run Tesseract OCR on the image
    const result = await Tesseract.recognize(file, 'eng', {
      logger: () => {} // Suppress console logs for cleaner UX
    })

    const extractedText = result.data.text.toLowerCase()

    // Define patterns to search for AAU
    const aauPatterns = [
      'addis ababa university',
      'aau',
      'አዲስ አበባ ዩኒቨርሲቲ', // Amharic text for AAU
      'addis abeba university' // Common spelling variation
    ]

    // Define patterns to search for AASTU
    const aastuPatterns = [
      'addis ababa science',
      'aastu',
      'science and technology university',
      'addis ababa science & technology',
      'addis ababa science and technology'
    ]

    // Check if any AAU patterns are found
    const foundAAU = aauPatterns.some(pattern =>
      extractedText.includes(pattern.toLowerCase())
    )

    // Check if any AASTU patterns are found
    const foundAASTU = aastuPatterns.some(pattern =>
      extractedText.includes(pattern.toLowerCase())
    )

    // If university match found, return match_found
    if (foundAAU || foundAASTU) {
      return {
        text: result.data.text,
        confidence: 'match_found',
        matchedPattern: foundAAU ? 'AAU' : 'AASTU'
      }
    }

    // If very little text extracted, the image is probably too blurry
    if (result.data.text.length < 10) {
      return {
        text: result.data.text,
        confidence: 'uncertain' // Image might be blurry or too dark
      }
    }

    // Text extracted but no university match - likely wrong university or non-ID image
    return {
      text: result.data.text,
      confidence: 'no_match'
    }

  } catch (error) {
    console.error('OCR processing error:', error)

    // On error, return uncertain so it goes to manual review
    return {
      text: '',
      confidence: 'uncertain'
    }
  }
}
