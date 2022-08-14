import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Ring, Orbit } from '@uiball/loaders'
import axios from 'axios'
import FadeIn from 'react-fade-in'

const Home = () => {
  const router = useRouter()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTopCollections()
  }, [])

  const getTopCollections = async () => {
    setLoading(true)
    const res = await axios.get(
      'https://api.reservoir.tools/collections/v4?includeTopBid=false&limit=20&sortBy=1DayVolume'
    )
    const top20 = res.data.collections

    const top20WithFloors = await Promise.all(
      top20.map(async (nft) => {
        const floors = await axios.get(
          `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=${nft.id}`
        )
        nft.floors = {}
        nft.floors.openSea = {
          floorPrice: floors.data.openSea.floorPrice || nft.floorAskPrice,
        }
        nft.floors.looksRare = {
          floorPrice: floors.data.looksRare.floorPrice || nft.floorAskPrice,
        }
        nft.floors.x2y2 = { floorPrice: null }
        return nft
      })
    )
    setCollections(top20WithFloors)
    setLoading(false)

    for (const nft of top20WithFloors) {
      const x2y2 = await axios.get(`/api/x2y2?contractAddress=${nft.id}`)
      nft.floors.x2y2 = {
        floorPrice: x2y2.data && ethers.utils.formatEther(x2y2.data),
      }
    }
    setCollections(top20)
    console.log(top20)
  }

  const cutNumber = (number, digitsAfterDot) => {
    const str = `${number}`

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center mt-60'>
        <Orbit size={50} color='#71717A' />
      </div>
    )
  }
  return (
    <FadeIn>
      <div className='container mx-auto'>
        <div className='flex flex-wrap items-stretch justify-center gap-8 mx-4'>
          {collections.map((nft) => (
            <div
              className='flex flex-col items-center w-80 text-white border border-zinc-800 rounded-box cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 gap-4 p-4'
              key={nft.id}
              onClick={() => router.push(`/${nft.id}`)}
            >
              <div className='flex items-center justify-center w-full gap-4'>
                <img
                  className='h-32 w-32 mask mask-squircle'
                  src={nft.sampleImages[0] || nft.image}
                />
                <div className='flex flex-col text-lg font-light tracking-wide w-32 gap-2'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 6 9'
                        fill='currentColor'
                        class='text-zinc-700'
                        width='16'
                        height='16'
                      >
                        <path d='M5.566 4.56 2.761 0 0 4.562l2.782 1.66 2.784-1.663Z'></path>
                        <path d='m5.566 5.116-2.79 1.625L0 5.116 2.782 9l2.784-3.884Z'></path>
                      </svg>
                      {cutNumber(
                        nft.floors.openSea.floorPrice.toLocaleString(
                          'fullwide',
                          { useGrouping: false }
                        ),
                        3
                      )}
                    </div>
                    <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                      <img className='h-3 w-3' src='/img/opensea-mono.png' />
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 6 9'
                        fill='currentColor'
                        class='text-zinc-700'
                        width='16'
                        height='16'
                      >
                        <path d='M5.566 4.56 2.761 0 0 4.562l2.782 1.66 2.784-1.663Z'></path>
                        <path d='m5.566 5.116-2.79 1.625L0 5.116 2.782 9l2.784-3.884Z'></path>
                      </svg>
                      {cutNumber(
                        nft.floors.looksRare.floorPrice.toLocaleString(
                          'fullwide',
                          { useGrouping: false }
                        ),
                        3
                      )}
                    </div>
                    <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                      <img className='h-3 w-3' src='/img/looksrare-mono.png' />
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 6 9'
                        fill='currentColor'
                        class='text-zinc-700'
                        width='16'
                        height='16'
                      >
                        <path d='M5.566 4.56 2.761 0 0 4.562l2.782 1.66 2.784-1.663Z'></path>
                        <path d='m5.566 5.116-2.79 1.625L0 5.116 2.782 9l2.784-3.884Z'></path>
                      </svg>
                      {nft.floors.x2y2.floorPrice ? (
                        cutNumber(
                          nft.floors.x2y2.floorPrice.toLocaleString(
                            'fullwide',
                            { useGrouping: false }
                          ),
                          3
                        )
                      ) : (
                        <Ring size={18} color='#FFFFFF' />
                      )}
                    </div>
                    <div className='flex items-center justify-center border border-zinc-800 rounded-full p-1.5'>
                      <img className='h-3 w-3' src='/img/x2y2-mono.png' />
                    </div>
                  </div>
                </div>
              </div>

              <p className='text-xl text-center'>{nft.name}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

export default Home
