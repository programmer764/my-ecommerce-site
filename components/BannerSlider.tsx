'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const banners = [
  { id: 1, src: '/banners/banner1.jpg', alt: 'Баннер 1' },
  { id: 2, src: '/banners/banner2.jpg', alt: 'Баннер 2' },
  { id: 3, src: '/banners/banner3.jpg', alt: 'Баннер 3' },
  { id: 4, src: '/banners/banner4.jpg', alt: 'Баннер 4' },
  { id: 5, src: '/banners/banner5.jpg', alt: 'Баннер 5' },
  { id: 6, src: '/banners/banner6.jpg', alt: 'Баннер 6' },
  { id: 7, src: '/banners/banner7.jpg', alt: 'Баннер 7' },
  { id: 8, src: '/banners/banner8.jpg', alt: 'Баннер 8' },
  { id: 9, src: '/banners/banner9.jpg', alt: 'Баннер 9' },
  { id: 10, src: '/banners/banner10.jpg', alt: 'Баннер 10' }
]

export default function BannerSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative w-full max-w-[829px] mx-auto"
      style={{ aspectRatio: '829 / 395' }} // задаём пропорции контейнера
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[index].id}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={banners[index].src}
            alt={banners[index].alt}
            fill
            className="object-contain" // чтобы картинка полностью влезала и масштабировалась пропорционально
            priority // чтобы подгружалась быстрее
            sizes="(max-width: 829px) 100vw, 829px"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
