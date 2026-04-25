# QPLAY Vendor Onboarding

Mobile-first vendor onboarding form. Built with Next.js 14 App Router + Tailwind CSS.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in your credentials
npm run dev
```

---

## Google Sheets setup

1. Create a Google Sheet. Copy the **Sheet ID** from the URL (`/d/<ID>/edit`).
2. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs → Enable **Google Sheets API**.
3. Create a **Service Account** → download the JSON key.
4. Set env vars:
   - `GOOGLE_SHEET_ID` — the sheet ID from step 1
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — `client_email` from the JSON key
   - `GOOGLE_PRIVATE_KEY` — `private_key` from the JSON key (paste as-is; newlines are handled)
5. **Share the Google Sheet** with the service account email (Editor role).

The first row will be used as a header. Add this manually if you want headers:

```
Timestamp | Business Name | Category | Location | Branch Count | Contact Name | Phone | Email | Instagram | Interests | Timeline | Description | Website | Notes | Logo URL
```

---

## Vercel Blob setup

1. In your Vercel project → Storage → **Create Blob Store**.
2. Copy `BLOB_READ_WRITE_TOKEN` to your env vars (Vercel dashboard + `.env.local`).

---

## Branding

Edit `lib/brandConfig.ts` — one object controls all visual identity.

## Deploy

```bash
vercel deploy
```

Add all env vars in the Vercel dashboard under Settings → Environment Variables.
