import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import debounce from 'lodash.debounce'
import axios from 'axios'

const Navbar = () => {
  const router = useRouter()
  const inputRef = useRef(null)
  const [searchList, setSearchList] = useState([])

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current.focus()
      }
    }
    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

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
    <div className='container mx-auto'>
      <div className='flex items-center justify-between border-b-2 border-zinc-800 pb-2 pt-16 mb-16 mx-4'>
        <NextLink href='/'>
          <div className='flex items-center cursor-pointer gap-2'>
            <img className='h-6 w-6' src='/img/logo.png' />

            <h1 className='text-xl font-medium hidden md:block'>
              <span className='text-blue-500'>NFT</span>{' '}
              <span className='text-green-500'>Floor</span>{' '}
              <span className='text-violet-500'>Diff</span>
            </h1>
          </div>
        </NextLink>

        <div className='relative'>
          <div className='flex items-center justify-between text-sm text-white bg-zinc-900 rounded-md w-60 p-2'>
            <input
              className='placeholder-zinc-700 bg-zinc-900 focus:outline-none px-2'
              type='text'
              placeholder='Search...'
              onChange={debounce((e) => searchCollection(e.target.value), 500)}
              onBlur={handleBlur}
              ref={inputRef}
              maxLength={25}
            />
            <kbd className='text-center text-xs text-zinc-700 bg-black border border-zinc-700 border-b-[3px] rounded-md px-1.5'>
              /
            </kbd>
          </div>

          <div className='flex flex-col items-center text-white bg-zinc-900/30 backdrop-blur-3xl absolute top-11 left-0 w-60 z-50'>
            {searchList.map((collection) => (
              <div
                className='flex items-center border border-zinc-800 hover:bg-zinc-800 cursor-pointer w-full gap-2 p-2'
                key={collection.collectionId}
                onMouseDown={() => handleClick(collection)}
              >
                <img
                  className='h-10 w-10'
                  src={collection.image || '/img/media-not-available.png'}
                />
                <p className='text-sm'>{collection.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
