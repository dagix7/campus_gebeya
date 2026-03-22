'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { uploadStudentId } from '@/app/actions/verification-actions'
import { extractTextFromImage } from '@/lib/ocr'
import type { OCRResult } from '@/types'

function SubmitButton({ isProcessing }: { isProcessing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || isProcessing}
      className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload Student ID'}
    </button>
  )
}

export default function VerifyIdForm() {
  const [state, formAction] = useActionState(uploadStudentId, { error: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isOCRProcessing, setIsOCRProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      setSelectedFile(null)
      setPreview(null)
      setOcrResult(null)
      return
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Run OCR (only for images, not PDFs)
    if (file.type.startsWith('image/')) {
      setIsOCRProcessing(true)
      try {
        const result = await extractTextFromImage(file)
        setOcrResult(result)
      } catch (error) {
        console.error('OCR error:', error)
        setOcrResult({
          text: '',
          confidence: 'uncertain'
        })
      } finally {
        setIsOCRProcessing(false)
      }
    } else {
      // PDF - skip OCR, send to manual review
      setOcrResult({
        text: 'PDF document - manual review required',
        confidence: 'uncertain'
      })
    }
  }

  const handleSubmit = (formData: FormData) => {
    if (!selectedFile || !ocrResult) {
      alert('Please select a file first')
      return
    }

    // Add OCR results to form data
    formData.append('ocr_confidence', ocrResult.confidence)
    formData.append('ocr_text', ocrResult.text.substring(0, 500))

    formAction(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Student ID Card
        </label>
        <input
          type="file"
          id="student_id"
          name="student_id"
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={handleFileChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: JPG, PNG, PDF (max 10MB)
        </p>
      </div>

      {preview && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Student ID preview"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
          </div>
        </div>
      )}

      {isOCRProcessing && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Analyzing your student ID... This may take 10-20 seconds.</span>
          </div>
        </div>
      )}

      {ocrResult && !isOCRProcessing && (
        <div className={`border rounded-lg px-4 py-3 ${
          ocrResult.confidence === 'match_found'
            ? 'bg-green-50 border-green-200 text-green-700'
            : ocrResult.confidence === 'no_match'
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        }`}>
          <p className="font-medium">
            {ocrResult.confidence === 'match_found' && (
              <>✓ University detected: {ocrResult.matchedPattern}! Your submission will be sent for admin review.</>
            )}
            {ocrResult.confidence === 'no_match' && (
              <>ℹ️ University text not automatically detected, but your submission will still be reviewed by our team. This is normal for older or worn IDs.</>
            )}
            {ocrResult.confidence === 'uncertain' && (
              <>ℹ️ Image quality unclear. Your submission will be sent for manual review. For faster approval, consider uploading a clearer photo.</>
            )}
          </p>
        </div>
      )}

      <SubmitButton isProcessing={isOCRProcessing} />

      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">Tips for best results:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Take photo in good lighting</li>
          <li>Ensure university name is clearly visible</li>
          <li>Avoid glare and shadows</li>
          <li>Keep ID card flat (not curved or wrinkled)</li>
          <li>Make sure text is sharp and readable</li>
        </ul>
      </div>
    </form>
  )
}
