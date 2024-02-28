// route handler enabling draft mode

import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'


export async function GET(request) {
   
    console.log('hit the mode')
    const model = request.nextUrl.searchParams.get("model")
    const slug = request.nextUrl.searchParams.get("slug")
    let preSlug = ''

    if (model === 'post') {
        preSlug = '/posts/'
    }
    if (model === 'page') {
        preSlug = '/'
    }
    if (model === 'landingPage') {
        preSlug = '/'
    }

    const url = `${process.env.URL}${preSlug}${slug}`
    console.log(url)

    const response = NextResponse.redirect(url)
  draftMode().enable()


console.log('hello world')

    return response


}