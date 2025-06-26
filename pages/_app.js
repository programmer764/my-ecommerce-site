// pages/_app.tsx
import { useState, useEffect } from 'react'
import Script from 'next/script'
import '../styles/globals.css'
import Head from 'next/head'
import DesktopHeader from '../components/DesktopHeader'
import MobileHeader from '../components/MobileHeader'
import DesktopFooter from '../components/DesktopFooter'
import MobileFooter from '../components/MobileFooter'
import Cart from '../components/Cart'
import { CartProvider } from '../components/CartContext'

function MyApp({ Component, pageProps, isMobile }) {
  const [isClientMobile, setIsClientMobile] = useState(isMobile)

  useEffect(() => {
    const updateMobile = () => {
      setIsClientMobile(window.innerWidth < 768)
    }
    updateMobile()
    window.addEventListener('resize', updateMobile)
    return () => window.removeEventListener('resize', updateMobile)
  }, [])

  return (
    <CartProvider>
      {/* подключаем reCAPTCHA v3 скрипт через next/script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('✅ Скрипт reCAPTCHA загружен глобально')
        }}
        onError={() => {
          console.error('❌ Ошибка загрузки reCAPTCHA')
        }}
      />

      {isClientMobile ? <MobileHeader /> : <DesktopHeader />}
      <Component {...pageProps} />
      <Cart />
      {isClientMobile ? <MobileFooter /> : <DesktopFooter />}
    </CartProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  let isMobile = false
  const { ctx } = appContext

  if (ctx.req) {
    const ua = ctx.req.headers['user-agent']
    if (ua) {
      const UAParser = require('ua-parser-js')
      const parser = new UAParser(ua)
      const result = parser.getResult()
      isMobile =
        result.device.type === 'mobile' ||
        result.device.type === 'tablet'
    }
  }

  const App = (await import('next/app')).default
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps, isMobile }
}

export default MyApp
