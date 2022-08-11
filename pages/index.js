import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import debounce from 'lodash.debounce'
import Head from 'next/head'

const Home = () => {
  const router = useRouter()
  const inputRef = useRef(null)
  const [collections, setCollections] = useState([])
  const [searchList, setSearchList] = useState([])

  useEffect(() => {
    getTopCollections()
  }, [])

  const getTopCollections = async () => {
    console.log('Fetching...')
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
  }

  const searchCollection = async (name) => {
    if (!name) {
      setSearchList([])
      return
    }
    const res = await axios.get(
      `https://api.reservoir.tools/search/collections/v1?name=${name}&limit=5`
    )
    setSearchList(res.data.collections)
  }

  const handleClick = (collection) => {
    router.push(`/${collection.collectionId}`)
    inputRef.current.value = ''
    setSearchList([])
  }

  const handleBlur = () => {
    inputRef.current.value = ''
    setSearchList([])
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
            className='input'
          />
          <div id='items'>
            {searchList.map((collection) => (
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

        {collections.map((nft) => (
          <div key={nft.id} onClick={() => router.push(`/${nft.id}`)}>
            <img src={nft.image} style={{ width: '100px', height: '100px' }} />
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

export default Home
