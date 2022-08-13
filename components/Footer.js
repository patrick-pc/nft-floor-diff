const Footer = () => {
  return (
    <footer className='flex flex-col items-center justify-center text-zinc-600 font-medium gap-2 pb-16 mt-16 mx-4 sticky top-[100vh]'>
      <a
        href='https://github.com/web3slinger/nft-floor-diff'
        target='_blank'
        className='opacity-75 hover:opacity-100'
      >
        👾 github
      </a>
      <a
        href='https://twitter.com/web3slinger'
        target='_blank'
        className='opacity-75 hover:opacity-100'
      >
        🕷 made by web3slinger
      </a>
    </footer>
  )
}

export default Footer
