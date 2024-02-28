import { SinglePage } from '@/queries/pages'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { notFound } from 'next/navigation'
import client from '../utils/client'
import { draftMode } from 'next/headers'
import { GraphQLClient } from 'graphql-request'

function convertTheme(themeString) {
  if (!themeString) return

  if (themeString == 'brand') return 'bg-lime-600 text-slate-50'
  if (themeString == 'hollow') return 'transparent'
  if (themeString == 'secondary') return 'bg-amber-700 text-white'
}

async function getPage(slug) {
  const { isEnabled } = draftMode()

  if (isEnabled) client.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_TOKEN}`)

  const response = await client.request(SinglePage, {slug})

  console.log(response)
  return response.landingPage
}

export async function generateMetadata({ params }) {
  const page = await getPage(params.slug)
  if (!page) return notFound()

  return {
    title: page?.seoOverride?.title || page.title,
    description: page.seo?.description || page.description,
    openGraph: {
      images: [
        {
          url: page?.seoOverride?.image?.url || page.coverImage?.url,
          width: page?.seoOverride?.image?.width || page.coverImage?.width,
          height: page?.seoOverride?.image?.height || page.coverImage?.height
        }
      ]
    }
  }
}

export default async function Page({ params }) {
  const page = await getPage(params.slug)
  if (!page) {
    return notFound()
  }
  return (
    <div className="divide-y divide-gray-200">
      <div className="pt-6 pb-8  max-w-3xl mx-auto space-y-2 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-lg leading-7 text-gray-500">{page.subtitle}</p>
        )}
      </div>
      <div className="pb-16 lg:pb-20">
        <div className="prose max-w-none pt-10 pb-8">
          { page.stripes && page.stripes.map(stripe => {
            if (stripe.__typename === 'StripeContent') {
              return (
              <section key={stripe.id} className={`py-10 my-2  ${convertTheme(stripe.theme)}`}>
                <div className='max-w-3xl mx-auto grid grid-cols-3 gap-5'>
                  { stripe?.image?.alignment == 'left' && <img className='m-0 h-full object-cover' src={stripe.image.image.url} /> }
                  <div className={`${stripe.image ? `col-span-2` : `col-span-3`}`}>
                    <h1 className='text-inherit'>{stripe.title}</h1>
                    {stripe?.content?.raw && <RichText content={stripe.content.raw} /> }
                  </div>
                  { stripe?.image?.alignment == 'right' && <img className='m-0 h-full object-cover' src={stripe.image.image.url} /> }

                  { stripe.button && (
                    <a
                      className={`rounded-lg text-sm text-center no-underline px-5 py-2.5 ${convertTheme(stripe.button.theme)}`}
                      href={stripe.button.link.externalUrl}>{stripe.button.link.displayText}</a>)}
                </div>
              </section>
              )
            }
          }) }
        </div>
      </div>
    </div>
  )
}
