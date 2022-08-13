import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Head from 'next/head'

const Home = () => {
  const router = useRouter()
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getTopCollections()
  }, [])

  const getTopCollections = async () => {
    const res = await axios.get(
      'https://api.reservoir.tools/collections/v4?includeTopBid=false&limit=20&sortBy=1DayVolume'
    )
    const top20 = res.data.collections

    const top20WithFloors = await Promise.all(
      top20.map(async (nft) => {
        const floors = await axios.get(
          `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=${nft.id}`
        )
        nft.floors = floors.data
        nft.floors.x2y2 = { floorPrice: null }
        return nft
      })
    )
    setCollections(top20WithFloors)

    for (const nft of top20) {
      const x2y2 = await axios.get(`/api/x2y2?contractAddress=${nft.id}`)
      nft.floors.x2y2 = {
        floorPrice: x2y2.data && ethers.utils.formatEther(x2y2.data),
      }
    }
    setCollections(top20)
    console.log(top20)
  }

  return (
    <div>
      <Head>
        <title>floordiff</title>
        <meta name='description' content='NFT Floor Difference' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='container mx-auto'>
          <div className='flex flex-wrap items-center justify-center gap-8 mx-4'>
            {collections.map((nft) => (
              <div
                className='flex flex-col items-center w-80 text-white border border-zinc-800 rounded-box cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 gap-4 p-4'
                key={nft.id}
                onClick={() => router.push(`/${nft.id}`)}
              >
                <div className='flex items-center justify-center w-full gap-4'>
                  <img
                    className='h-32 w-32 mask mask-squircle'
                    src={nft.sampleImages[0] || '/img/media-not-available.png'}
                  />
                  <div className='flex flex-col text-lg font-thin w-32 gap-2'>
                    <div className='flex items-center justify-between gap-4'>
                      <span>{nft.floors.openSea.floorPrice}</span>
                      <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                        <img className='h-3 w-3' src='/img/opensea-mono.png' />
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                      <span>{nft.floors.looksRare.floorPrice}</span>
                      <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                        <img
                          className='h-3 w-3'
                          src='/img/looksrare-mono.png'
                        />
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                      <span>
                        {nft.floors.x2y2.floorPrice
                          ? nft.floors.x2y2.floorPrice
                          : 'Loading...'}
                      </span>
                      <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                        <img className='h-3 w-3' src='/img/x2y2-mono.png' />
                      </div>
                    </div>
                  </div>
                </div>

                <p className='text-xl'>{nft.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
