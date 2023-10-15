import Image from 'next/image'
import Signin from './signin/page'
import { useRouter } from 'next/router';
import Landing from './landing/page'

export default function Home() {
  return (
      <Landing></Landing>
  )
}
