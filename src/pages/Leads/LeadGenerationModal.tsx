import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { generateLeads, type ApolloSearchParams } from '@/api/leads'
import { useAuth } from '@/contexts/AuthContext'
import styles from './LeadGenerationModal.module.css'

interface LeadGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (count: number) => void
}

export function LeadGenerationModal({ isOpen, onClose, onSuccess }: LeadGenerationModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [params, setParams] = useState<ApolloSearchParams>({
    person_titles: [],
    person_locations: [],
    q_keywords: '',
    per_page: 20
  })

  const [titleInput, setTitleInput] = useState('')
  const [locationInput, setLocationInput] = useState('')

  const handleAddTitle = () => {
    if (titleInput.trim()) {
      setParams(p => ({ ...p, person_titles: [...(p.person_titles || []), titleInput.trim()] }))
      setTitleInput('')
    }
  }

  const handleAddLocation = () => {
    if (locationInput.trim()) {
      setParams(p => ({ ...p, person_locations: [...(p.person_locations || []), locationInput.trim()] }))
      setLocationInput('')
    }
  }

  const handleRemoveTitle = (title: string) => {
    setParams(p => ({ ...p, person_titles: (p.person_titles || []).filter(t => t !== title) }))
  }

  const handleRemoveLocation = (loc: string) => {
    setParams(p => ({ ...p, person_locations: (p.person_locations || []).filter(l => l !== loc) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setLoading(true)
    setError(null)
    try {
      const res = await generateLeads(token, {
        ...params,
        // Make sure to include the last inputs if they weren't added by clicking the buttons
        person_titles: titleInput.trim() 
          ? [...(params.person_titles || []), titleInput.trim()] 
          : params.person_titles,
        person_locations: locationInput.trim() 
          ? [...(params.person_locations || []), locationInput.trim()] 
          : params.person_locations,
      })
      onSuccess(res.total)
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to generate leads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Leads (Apollo.io)">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="q_keywords">Keywords (Company, Skills, etc.)</label>
          <input
            id="q_keywords"
            type="text"
            className={styles.input}
            value={params.q_keywords}
            onChange={e => setParams(p => ({ ...p, q_keywords: e.target.value }))}
            placeholder="e.g. SaaS, Artificial Intelligence"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="titles">Job Titles</label>
          <div className={styles.inputGroup}>
            <input
              id="titles"
              type="text"
              className={styles.input}
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTitle())}
              placeholder="e.g. CEO, Marketing Manager"
            />
            <Button type="button" variant="secondary" onClick={handleAddTitle}>Add</Button>
          </div>
          <div className={styles.chips}>
            {params.person_titles?.map(t => (
              <span key={t} className={styles.chip}>
                {t} <button type="button" onClick={() => handleRemoveTitle(t)}>&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="locations">Locations</label>
          <div className={styles.inputGroup}>
            <input
              id="locations"
              type="text"
              className={styles.input}
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
              placeholder="e.g. San Francisco, California"
            />
            <Button type="button" variant="secondary" onClick={handleAddLocation}>Add</Button>
          </div>
          <div className={styles.chips}>
            {params.person_locations?.map(l => (
              <span key={l} className={styles.chip}>
                {l} <button type="button" onClick={() => handleRemoveLocation(l)}>&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="per_page">Results Count</label>
          <select
            id="per_page"
            className={styles.input} // reusing input style
            value={params.per_page}
            onChange={e => setParams(p => ({ ...p, per_page: parseInt(e.target.value) }))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Searching & Extracting...' : 'Generate New Leads'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
