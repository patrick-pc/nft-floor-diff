import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

const Collection = () => {
  const router = useRouter()
  const { address } = router.query
  const [collection, setCollection] = useState({})

  useEffect(() => {
    if (!address) return
    getCollection(address)
  }, [address])

  const getCollection = async (address) => {
    console.log('Fetching...')
    const res = await axios.get(
      `https://api.reservoir.tools/collection/v2?id=${address}`
    )
    const col = res.data.collection
    console.log(col)

    const floors = await axios.get(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=${address}`
    )
    col.floors = floors.data

    const x2y2 = await axios.get(`/api/x2y2?contractAddress=${address}`)
    col.floors.x2y2 = {
      floorPrice: x2y2.data && ethers.utils.formatEther(x2y2.data),
    }
    setCollection(col)
  }

  return (
    <div>
      <h1>{collection.name}</h1>

      {collection.floors && (
        <div>
          <img src={collection.metadata.imageUrl} />
          <p>{collection.floors.openSea.floorPrice}</p>
          <p>{collection.floors.looksRare.floorPrice}</p>
          <p>{collection.floors.x2y2.floorPrice}</p>
        </div>
      )}
    </div>
  )
}

export default Collection
