'use client'

import { useState, useRef, useCallback } from 'react'
import { brandConfig } from '@/lib/brandConfig'

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  businessName: string
  category: string
  location: string
  branchCount: string
  // Step 2
  contactName: string
  phone: string
  email: string
  instagram: string
  // Step 3
  interests: string[]
  timeline: string
  // Step 4
  logo: File | null
  logoPreview: string
  description: string
  website: string
  notes: string
}

const INITIAL: FormData = {
  businessName: '', category: '', location: '', branchCount: '',
  contactName: '', phone: '', email: '', instagram: '',
  interests: [], timeline: '',
  logo: null, logoPreview: '', description: '', website: '', notes: '',
}

const CATEGORIES = [
  'Food & Beverage', 'Retail & Shopping', 'Health & Wellness',
  'Entertainment', 'Beauty & Lifestyle', 'Sports & Fitness',
  'Education', 'Travel & Tourism', 'Events & Experiences', 'Other',
]

const INTERESTS = [
  'Discounts / offers', 'Featured listing', 'Content collaboration',
  'Booking / reservation support', 'Event / experience promotion', 'Not sure yet',
]

const TIMELINES = ['ASAP', 'This week', 'This month', 'Just exploring']

const STEPS = ['Business', 'Contact', 'QPLAY Fit', 'Details', 'Review']

// ─── Sub-components ───────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-white/70 mb-1.5">
      {children}{required && <span className="text-amber-400 ml-0.5">*</span>}
    </label>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm transition-all ${props.className ?? ''}`}
    />
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none transition-all ${props.className ?? ''}`}
    />
  )
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-[#1a1030] border border-white/10 rounded-xl px-4 py-3 text-white text-sm transition-all appearance-none ${props.className ?? ''}`}
    >
      {children}
    </select>
  )
}

function Pill({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
        selected
          ? 'border-transparent text-white'
          : 'border-white/15 text-white/60 hover:border-white/30 hover:text-white/80'
      }`}
      style={selected ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
    >
      {selected && <span className="mr-1.5">✓</span>}
      {label}
    </button>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1.5 text-xs text-red-400">{msg}</p>
}

// ─── Step components ──────────────────────────────────────────────────────────
function Step1({ data, set, errors }: StepProps) {
  return (
    <div className="space-y-5 fade-up">
      <div>
        <Label required>Business name</Label>
        <Input
          placeholder="e.g. Café Doha"
          value={data.businessName}
          onChange={e => set('businessName', e.target.value)}
        />
        <FieldError msg={errors.businessName} />
      </div>
      <div>
        <Label required>Category</Label>
        <Select value={data.category} onChange={e => set('category', e.target.value)}>
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <FieldError msg={errors.category} />
      </div>
      <div>
        <Label>Location <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Input
          placeholder="e.g. The Pearl, Doha"
          value={data.location}
          onChange={e => set('location', e.target.value)}
        />
      </div>
      <div>
        <Label>Number of branches <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Input
          type="number"
          min="1"
          placeholder="1"
          value={data.branchCount}
          onChange={e => set('branchCount', e.target.value)}
        />
      </div>
    </div>
  )
}

function Step2({ data, set, errors }: StepProps) {
  return (
    <div className="space-y-5 fade-up">
      <div>
        <Label required>Your name</Label>
        <Input
          placeholder="e.g. Sara Al-Mansoori"
          value={data.contactName}
          onChange={e => set('contactName', e.target.value)}
        />
        <FieldError msg={errors.contactName} />
      </div>
      <div>
        <Label required>Phone number</Label>
        <Input
          type="tel"
          placeholder="+974 5555 1234"
          value={data.phone}
          onChange={e => set('phone', e.target.value)}
        />
        <FieldError msg={errors.phone} />
      </div>
      <div>
        <Label>Email <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Input
          type="email"
          placeholder="hello@mybusiness.qa"
          value={data.email}
          onChange={e => set('email', e.target.value)}
        />
      </div>
      <div>
        <Label>Instagram <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
          <Input
            className="pl-8"
            placeholder="mybusiness"
            value={data.instagram}
            onChange={e => set('instagram', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function Step3({ data, set, errors }: StepProps) {
  const toggle = (interest: string) => {
    const next = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest]
    set('interests', next)
  }
  return (
    <div className="space-y-6 fade-up">
      <div>
        <Label required>What are you interested in?</Label>
        <p className="text-xs text-white/40 mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <Pill key={i} label={i} selected={data.interests.includes(i)} onClick={() => toggle(i)} />
          ))}
        </div>
        <FieldError msg={errors.interests} />
      </div>
      <div>
        <Label required>When are you looking to get started?</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {TIMELINES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => set('timeline', t)}
              className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                data.timeline === t
                  ? 'text-white border-transparent'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
              style={data.timeline === t ? { background: 'var(--color-primary)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
        <FieldError msg={errors.timeline} />
      </div>
    </div>
  )
}

function Step4({ data, set, errors }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Max file size is 10MB.')
      return
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Accepted formats: PNG, JPG, WEBP, SVG')
      return
    }
    const reader = new FileReader()
    reader.onload = e => set('logoPreview', e.target?.result as string)
    reader.readAsDataURL(file)
    set('logo', file)
  }, [set])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-5 fade-up">
      <div>
        <Label required>Business logo / image</Label>
        {data.logoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.logoPreview}
              alt="Logo preview"
              className="w-full h-44 object-contain p-4"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all"
              >Replace</button>
              <button
                type="button"
                onClick={() => { set('logo', null); set('logoPreview', '') }}
                className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg transition-all"
              >Remove</button>
            </div>
          </div>
        ) : (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-white/30 transition-all"
          >
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-white/50 text-sm">Drop your logo here or <span className="underline">browse</span></p>
            <p className="text-white/25 text-xs mt-1">PNG, JPG, WEBP, SVG · Max 10MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <FieldError msg={errors.logo} />
      </div>
      <div>
        <Label>About your business <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Textarea
          placeholder="Tell QPLAY what makes you special…"
          value={data.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Website <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Input
          placeholder="https://mybusiness.qa"
          value={data.website}
          onChange={e => set('website', e.target.value)}
        />
      </div>
      <div>
        <Label>Anything else? <span className="text-white/30 text-xs font-normal">(optional)</span></Label>
        <Textarea
          placeholder="Notes, questions, special requests…"
          value={data.notes}
          onChange={e => set('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex gap-3 py-3 border-b border-white/6 last:border-0">
      <span className="text-white/40 text-sm w-32 shrink-0">{label}</span>
      <span className="text-white text-sm break-all">{value}</span>
    </div>
  )
}

function Step5({ data }: { data: FormData }) {
  return (
    <div className="fade-up space-y-4">
      <p className="text-white/50 text-sm mb-4">Review your details before submitting.</p>
      {data.logoPreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.logoPreview} alt="Logo" className="h-16 w-16 object-contain rounded-xl border border-white/10 bg-white/5 p-1 mb-2" />
      )}
      <div className="card-glass rounded-2xl px-4">
        <ReviewRow label="Business" value={data.businessName} />
        <ReviewRow label="Category" value={data.category} />
        <ReviewRow label="Location" value={data.location} />
        <ReviewRow label="Branches" value={data.branchCount} />
        <ReviewRow label="Contact" value={data.contactName} />
        <ReviewRow label="Phone" value={data.phone} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Instagram" value={data.instagram ? `@${data.instagram}` : ''} />
        <ReviewRow label="Interests" value={data.interests.join(', ')} />
        <ReviewRow label="Timeline" value={data.timeline} />
        <ReviewRow label="Description" value={data.description} />
        <ReviewRow label="Website" value={data.website} />
        <ReviewRow label="Notes" value={data.notes} />
      </div>
    </div>
  )
}

function SuccessScreen() {
  return (
    <div className="fade-up text-center py-8 space-y-4">
      <div className="check-pop text-6xl">🎉</div>
      <h2 className="text-2xl font-bold text-white">You're on the list!</h2>
      <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
        Thanks for joining {brandConfig.brandName}. Our team will be in touch within 48 hours.
      </p>
    </div>
  )
}

// ─── Validation ───────────────────────────────────────────────────────────────
type Errors = Partial<Record<string, string>>
type StepProps = { data: FormData; set: (k: string, v: unknown) => void; errors: Errors }

function validate(step: number, data: FormData): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!data.businessName.trim()) e.businessName = 'Business name is required.'
    if (!data.category) e.category = 'Please select a category.'
  }
  if (step === 1) {
    if (!data.contactName.trim()) e.contactName = 'Your name is required.'
    if (!data.phone.trim()) e.phone = 'Phone number is required.'
  }
  if (step === 2) {
    if (!data.interests.length) e.interests = 'Select at least one interest.'
    if (!data.timeline) e.timeline = 'Please select a timeline.'
  }
  if (step === 3) {
    if (!data.logo) e.logo = 'Please upload a logo or image.'
  }
  return e
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const set = useCallback((key: string, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }, [])

  const progress = ((step + (submitted ? 1 : 0)) / STEPS.length) * 100

  const next = () => {
    const errs = validate(step, data)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const submit = async () => {
    setSubmitting(true)
    setServerError('')
    try {
      const fd = new FormData()
      fd.append('businessName', data.businessName)
      fd.append('category', data.category)
      fd.append('location', data.location)
      fd.append('branchCount', data.branchCount)
      fd.append('contactName', data.contactName)
      fd.append('phone', data.phone)
      fd.append('email', data.email)
      fd.append('instagram', data.instagram)
      fd.append('interests', data.interests.join(', '))
      fd.append('timeline', data.timeline)
      fd.append('description', data.description)
      fd.append('website', data.website)
      fd.append('notes', data.notes)
      if (data.logo) fd.append('logo', data.logo)

      const res = await fetch('/api/submit', { method: 'POST', body: fd })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Unknown error')
      setSubmitted(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepComponents = [
    <Step1 key={0} data={data} set={set} errors={errors} />,
    <Step2 key={1} data={data} set={set} errors={errors} />,
    <Step3 key={2} data={data} set={set} errors={errors} />,
    <Step4 key={3} data={data} set={set} errors={errors} />,
    <Step5 key={4} data={data} />,
  ]

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-start px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8 fade-up">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 font-bold text-lg"
          style={{ background: 'var(--color-primary)' }}
        >
          {brandConfig.brandName.slice(0, 1)}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{brandConfig.headline}</h1>
        <p className="text-white/45 text-sm mt-1 max-w-xs">{brandConfig.subheadline}</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md card-glass rounded-3xl shadow-2xl p-6">
        {submitted ? (
          <SuccessScreen />
        ) : (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`text-xs font-medium transition-colors ${
                      i === step ? 'text-white' : i < step ? 'text-white/50' : 'text-white/20'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <div className="progress-bar h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Step title */}
            <h2 className="text-base font-semibold text-white mb-5">
              {step === 0 && '🏪 Business basics'}
              {step === 1 && '👤 Contact details'}
              {step === 2 && '⚡ Your QPLAY fit'}
              {step === 3 && '🖼️ Logo & extra info'}
              {step === 4 && '✅ Review & submit'}
            </h2>

            {stepComponents[step]}
            
            {step === STEPS.length - 1 && (
  <label className="flex items-start gap-3 mt-6 cursor-pointer">
    <input
      type="checkbox"
      checked={confirmed}
      onChange={e => setConfirmed(e.target.checked)}
      className="mt-0.5 accent-violet-500 w-4 h-4 shrink-0"
    />
    <span className="text-white/50 text-xs leading-relaxed">
      I confirm that the information provided is accurate and I agree to be contacted by QPLAY.
    </span>
  </label>
)}

            {serverError && (
              <p className="mt-4 text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">{serverError}</p>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-7">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:bg-white/5 transition-all"
                >
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn-primary flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting || !confirmed}
                  className="btn-primary flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit ✨'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <p className="text-white/20 text-xs mt-8">{brandConfig.footerText}</p>
    </div>
  )
}
