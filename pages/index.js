import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import debounce from 'lodash.debounce'
import Head from 'next/head'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [datalist, setDatalist] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    getTopCollections()
  }, [])

  const getTopCollections = async () => {
    console.log('Fetching...')
    const res = await axios.get(
      'https://api.reservoir.tools/collections/v4?includeTopBid=false&limit=20&sortBy=1DayVolume'
    )
    const top20 = res.data.collections
    // setNfts(top20)

    const result = await Promise.all(
      top20.map(async (nft) => {
        const floors = await axios.get(
          `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=${nft.id}`
        )
        nft.floors = floors.data
        nft.floors.x2y2 = { floorPrice: null }
        return nft
      })
    )
    setNfts(result)
    console.log(result)

    for (const nft of top20) {
      const x2y2 = await axios.get(`/api/x2y2?contractAddress=${nft.id}`)
      nft.floors.x2y2 = {
        floorPrice: x2y2.data && ethers.utils.formatEther(x2y2.data),
      }
    }
    setNfts(top20)
  }

  const searchCollection = async (name) => {
    if (!name) {
      setDatalist([])
      return
    }
    const res = await axios.get(
      `https://api.reservoir.tools/search/collections/v1?name=${name}&limit=5`
    )
    setDatalist(res.data.collections)
    console.log(res.data.collections)
  }

  const handleClick = (collection) => {
    console.log(collection)
    inputRef.current.value = ''
    setDatalist([])
  }

  const handleBlur = () => {
    inputRef.current.value = ''
    setDatalist([])
  }

  return (
    <div>
      <Head>
        <title>floordiff</title>
        <meta name='description' content='NFT Floor Difference' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>
          <input
            type='text'
            placeholder='contract address'
            onChange={debounce((e) => searchCollection(e.target.value), 500)}
            onBlur={handleBlur}
            ref={inputRef}
          />
          <div id='items'>
            {datalist.map((collection) => (
              <div
                key={collection.collectionId}
                onMouseDown={() => handleClick(collection)}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  style={{ width: '50px', height: '50px' }}
                />
                {collection.name}
              </div>
            ))}
          </div>
        </div>

        {nfts.map((nft) => (
          <div key={nft.id}>
            <h1>{nft.name}</h1>
            <p>{nft.floors.openSea.floorPrice}</p>
            <p>{nft.floors.looksRare.floorPrice}</p>
            <p>
              {nft.floors.x2y2.floorPrice
                ? nft.floors.x2y2.floorPrice
                : 'Loading...'}
            </p>
          </div>
        ))}
      </main>
    </div>
  )
}
