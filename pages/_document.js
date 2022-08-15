import Document, { Html, Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://vitals.vercel-insights.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
            rel='stylesheet'
          />
          <meta property='og:url' content='https://nftfloordiff.com' />
          <meta property='og:site_name' content='NFT Floor Diff' />
          <meta property='og:image' content='/img/logo.png' />
          <meta name='theme-color' content='#000000' />
          <meta name='twitter:card' content='summary' />
          <meta
            name='twitter:image'
            content='https://nftfloordiff.com/img/logo.png'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
