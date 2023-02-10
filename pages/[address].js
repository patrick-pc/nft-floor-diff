import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Orbit } from '@uiball/loaders'
import axios from 'axios'
import FadeIn from 'react-fade-in'

const Collection = () => {
  const router = useRouter()
  const { address } = router.query
  const [collection, setCollection] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return
    getCollection(address)
  }, [address])

  const getCollection = async (address) => {
    setLoading(true)
    const res = await axios.get(
      `https://api.reservoir.tools/collection/v2?id=${address}`
    )
    const col = res.data.collection

    if (!col) return

    const floors = await axios.get(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=${address}`
    )
    col.floors = {}
    col.floors.openSea = {
      floorPrice: floors.data.openSea.floorPrice || 0,
    }
    col.floors.looksRare = {
      floorPrice: floors.data.looksRare.floorPrice || 0,
    }

    const x2y2 = await axios.get(`/api/x2y2?contractAddress=${address}`)
    col.floors.x2y2 = {
      floorPrice: x2y2.data ? ethers.utils.formatEther(x2y2.data) : 0,
    }
    setCollection(col)
    setLoading(false)
  }

  const cutNumber = (number, digitsAfterDot) => {
    const str = `${number}`

    return str.slice(0, str.indexOf('.') + digitsAfterDot + 1)
  }

  if (loading || !collection.floors) {
    return (
      <div className='flex items-center justify-center mt-60'>
        <Orbit size={50} color='#71717A' />
      </div>
    )
  }
  return (
    <FadeIn>
      <div className='container mx-auto'>
        <div className='flex flex-col items-center justify-center gap-8 mx-4'>
          <div className='flex flex-col md:flex-row items-center justify-center text-center text-white gap-8 p-4'>
            <img
              className='h-40 w-40 mask mask-squircle'
              src={
                (collection.floors && collection.sampleImages[0]) ||
                '/img/media-not-available.png'
              }
            />
            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='text-3xl font-medium'>{collection.name}</h1>
              <div className='flex gap-2 text-sm text-zinc-700'>
                {collection.metadata.externalUrl && (
                  <a
                    className='hover:underline'
                    href={collection.metadata.externalUrl}
                    target='_blank'
                  >
                    website
                  </a>
                )}
                {collection.metadata.discordUrl && (
                  <a
                    className='hover:underline'
                    href={collection.metadata.discordUrl}
                    target='_blank'
                  >
                    discord
                  </a>
                )}

                {collection.metadata.twitterUsername && (
                  <a
                    className='hover:underline'
                    href={`https://twitter.com/${collection.metadata.twitterUsername}`}
                    target='_blank'
                  >
                    twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-stretch justify-center gap-8'>
            <div className='flex flex-col items-center justify-center w-80 text-white bg-black border border-zinc-800 rounded-box gap-4 p-4'>
              <h2 className='font-light'>Floor Price</h2>

              <div className='flex items-center text-center text-lg font-light tracking-wide w-full'>
                <a
                  className='flex flex-col flex-1 items-center justify-center gap-1'
                  href={`https://opensea.io/collection/${collection.slug}`}
                  target='_blank'
                >
                  <img className='h-5 w-5' src='/img/opensea.png' />
                  <p>
                    {cutNumber(
                      collection.floors.openSea.floorPrice.toLocaleString(
                        'fullwide',
                        {
                          useGrouping: false,
                        }
                      ),
                      3
                    )}
                  </p>
                </a>
                <a
                  className='flex flex-col flex-1 items-center text-lg font-light tracking-wide justify-center border-x border-zinc-800 gap-1'
                  href={`https://looksrare.org/collections/${collection.id}`}
                  target='_blank'
                >
                  <img className='h-5 w-5' src='/img/looksrare.png' />
                  <p>
                    {cutNumber(
                      collection.floors.looksRare.floorPrice.toLocaleString(
                        'fullwide',
                        { useGrouping: false }
                      ),
                      3
                    )}
                  </p>
                </a>
                <a
                  className='flex flex-col flex-1 items-center text-lg font-light tracking-wide justify-center gap-1'
                  href={`https://x2y2.io/collection/${collection.slug}`}
                  target='_blank'
                >
                  <img className='h-5 w-5' src='/img/x2y2.png' />
                  <p>
                    {cutNumber(
                      collection.floors.x2y2.floorPrice.toLocaleString(
                        'fullwide',
                        {
                          useGrouping: false,
                        }
                      ),
                      3
                    )}
                  </p>
                </a>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center w-80 text-white bg-black border border-zinc-800 rounded-box gap-4 p-4'>
              <h2 className='font-light'>Floor Sale Change</h2>

              <div className='flex items-center text-center text-lg font-light tracking-wide w-full'>
                <div className='flex flex-col flex-1 items-center justify-center'>
                  <p className='text-sm text-blue-500'>24h:</p>
                  <p>
                    {collection.floorSaleChange['7day']
                      ? cutNumber(
                          collection.floorSaleChange['7day'].toLocaleString(
                            'fullwide',
                            {
                              useGrouping: false,
                            }
                          ),
                          3
                        )
                      : '0'}
                  </p>
                </div>
                <div className='flex flex-col flex-1 items-center text-lg font-light tracking-wide justify-center border-x border-zinc-800'>
                  <p className='text-sm text-green-500'>7d:</p>
                  <p>
                    {collection.floorSaleChange['7day']
                      ? cutNumber(
                          collection.floorSaleChange['7day'].toLocaleString(
                            'fullwide',
                            {
                              useGrouping: false,
                            }
                          ),
                          3
                        )
                      : '0'}
                  </p>
                </div>
                <div className='flex flex-col flex-1 items-center text-lg font-light tracking-wide justify-center'>
                  <p className='text-sm text-violet-500'>30d:</p>
                  <p>
                    {collection.floorSaleChange['30day']
                      ? cutNumber(
                          collection.floorSaleChange['30day'].toLocaleString(
                            'fullwide',
                            {
                              useGrouping: false,
                            }
                          ),
                          3
                        )
                      : '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default Collection
