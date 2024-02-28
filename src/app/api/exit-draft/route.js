import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET(request) {
    draftMode().disable()
    const response = NextResponse.redirect(process.env.URL)
    return response
}
    