import { SinglePage } from '@/queries/pages'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { notFound } from 'next/navigation'
import client from '../utils/client'
import { draftMode } from 'next/headers'
import { GraphQLClient } from 'graphql-request'
import Link from 'next/link'

function convertTheme(themeString) {
  if (!themeString) return

  if (themeString == 'brand') return 'bg-lime-600 text-slate-50'
  if (themeString == 'hollow') return 'transparent'
  if (themeString == 'secondary') return 'bg-amber-700 text-white'
}

function StripeContent({stripe}) {
  return (
    <div className='max-w-3xl mx-auto md:grid grid-cols-3 gap-5'>
                  { stripe?.image?.alignment == 'left' && <img className='m-0 h-full object-cover' src={stripe.image.image.url} /> }
                  <div className={`${stripe.image ? `col-span-2` : `col-span-3`}`}>
                    <h2 className='text-inherit text-3xl mt-0'>{stripe.title}</h2>
                    {stripe?.content?.raw && <RichText content={stripe.content.raw} /> }
                  </div>
                  { stripe?.image?.alignment == 'right' && <img className='m-0 mb-5 h-full object-cover' src={stripe.image.image.url} /> }

                  { stripe.button && (
                    <a
                      className={`rounded-lg text-sm text-center no-underline px-5 py-2.5 ${convertTheme(stripe.button.theme)}`}
                      href={stripe.button.link.externalUrl}>{stripe.button.link.displayText}</a>)}
                </div>
  )
}
function StripeGrid({stripe}) {

  return(
    <div className='max-w-3xl mx-auto'>
      <h2 className='text-inherit text-3xl mt-0 col-span-3'>{stripe.title}</h2>
      {stripe?.contet?.raw && <RichText content={stripe.contet.raw} /> }

      <div className='grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-10'>
      {stripe?.posts.map(post => (
        <article className='' key={post.id}>
          <h3 className="text-inherit"><Link className='no-underline text-inherit' href={`/posts/${post.slug}`}>{post.title}</Link></h3>
          <p>{post.excerpt}</p>
          <Link className=" text-inherit" href={`/posts/${post.slug}`}>Read More &raquo;</Link>
        </article>
      ))}
    </div>
    </div>
  )
}

function Stripe({stripe}) {
  return (
    <section key={stripe.id} className={`py-10 px-4 my-2  ${convertTheme(stripe.theme)}`}>
                {(stripe.__typename == 'StripeContent') && <StripeContent stripe={stripe} />}
                {(stripe.__typename == 'StripeGrid') && <StripeGrid stripe={stripe} />}
    </section>
  )
}


async function getPage(slug) {
  const { isEnabled } = draftMode()

  if (isEnabled) client.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_TOKEN}`)

  const response = await client.request(SinglePage, {slug})

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
          { page.stripes && page.stripes.map(stripe => (
            <Stripe key={stripe.id} stripe={stripe} />
          )
              )
            }
          
        </div>
      </div>
    </div>
  )
}
