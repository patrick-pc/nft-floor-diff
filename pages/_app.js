import '../styles/globals.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>NFT Floor Diff</title>
        <meta name='description' content='NFT Floor Difference' />
        <link rel='icon' href='/img/logo.png' />
      </Head>
      <div className='min-h-screen w-full'>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  )
}

export default MyApp
