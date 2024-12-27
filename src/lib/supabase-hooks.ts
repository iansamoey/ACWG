import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useSupabaseStorage(bucket: string, filename: string) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPublicUrl = async () => {
      try {
        const { data } = await supabase.storage.from(bucket).getPublicUrl(filename)
        if (data) {
          setPublicUrl(data.publicUrl)
        } else {
          throw new Error('Failed to get public URL')
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'))
      }
    }

    fetchPublicUrl()
  }, [bucket, filename])

  return { publicUrl, error }
}

