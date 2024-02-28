const AllPages = `
  query AllPages {
    pages {
      id
      slug
      title
    }
  }
`

const SinglePage = `
  query SinglePage($slug: String!) {
    landingPage(where: { slug: $slug }) {
      slug
      title
      stripes {
        
        __typename
        ... on StripeContent {
          id
          title
          theme
          image {
            alignment
            image {
              url
            }
          }
          content {
            raw
          }
          button {
            theme
            link {
              externalUrl
              displayText
              page {
                ... on LandingPage {
                  id
                  slug
                  title
                }
              }
            }
          }
        }
        ... on StripeGrid {
          id
          contet {
            raw
          }
          title
        }
      }
    }
  }
`

export { AllPages, SinglePage }
