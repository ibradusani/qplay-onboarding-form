import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { appendToSheet } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // ── Upload logo ──────────────────────────────────────────────────────────
    const logo = formData.get('logo') as File | null
    let logoUrl = ''
    if (logo && logo.size > 0) {
      const blob = await put(`vendors/${Date.now()}-${logo.name}`, logo, {
        access: 'public',
      })
      logoUrl = blob.url
    }

    // ── Build sheet row ──────────────────────────────────────────────────────
    const row = [
      new Date().toISOString(),
      formData.get('businessName') as string,
      formData.get('category') as string,
      formData.get('location') as string,
      formData.get('branchCount') as string,
      formData.get('contactName') as string,
      formData.get('phone') as string,
      formData.get('email') as string,
      formData.get('instagram') as string,
      formData.get('interests') as string,
      formData.get('timeline') as string,
      formData.get('description') as string,
      formData.get('website') as string,
      formData.get('notes') as string,
      logoUrl,
    ]

    await appendToSheet(row)

    return NextResponse.json({ success: true, logoUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 })
  }
}
