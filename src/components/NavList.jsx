import Link from 'next/link'
import { SingleNav } from '@/queries/navigations'
import client from '@/app/utils/client'
async function getNav(navId) {
  const res = await client.request(SingleNav, {navId})

  if (res.errors) {
    console.error(res.errors)
    throw new Error(res.errors[0].message)
  }
  return res.navigation.link
}

export default async function NavList({ navId }) {
  const navItems = await getNav(navId)
  return (
    <>
      {navItems.map((navItem) => {
        const url = navItem.externalUrl || navItem.page.slug
        return (
          <li key={navItem.id}>
            <Link href={`/${url}`}>{navItem.displayText}</Link>
          </li>
        )
      })}
    </>
  )
}
