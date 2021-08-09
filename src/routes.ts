import { Router } from '@layer0/core/router'
import { CACHE_ASSETS } from './cache'
import shoppingFlowRouteHandler from './shoppingFlowRouteHandler'

export default new Router()
  .match('/', shoppingFlowRouteHandler)
  .match('/home', shoppingFlowRouteHandler)
  .match('/c/:path*', shoppingFlowRouteHandler)
  .match('/p/:path*', shoppingFlowRouteHandler)
  .match('/service-worker.js', ({ serviceWorker }) => serviceWorker('dist/service-worker.js'))
  .match('/main.js', ({ serveStatic, cache }) => {
    cache(CACHE_ASSETS)
    return serveStatic('dist/browser.js')
  })
  .match('/content/:path*', ({ proxy }) => {
    return proxy('origin', { path: ':path' })
  })
  .match('/on/:path*', ({ proxy, cache, removeUpstreamResponseHeader }) => {
    removeUpstreamResponseHeader('set-cookie')
    cache(CACHE_ASSETS)
    return proxy('origin')
  })
  // relativizing the static content from zmags domain etc.
  .match('/static/:path*', ({ proxy, cache }) => {
    cache(CACHE_ASSETS)
    return proxy('zmags', {
      transformResponse: (request) => {
        request.body = request.body
                        .toString()
                        .replace(/(https:)?\/\/images\.creator-prod\.zmags\.com/g, '/imageszmags')
                        .replace(/(https:)?\/\/www\.slumberland\.com/g, '')
                        .replace(/(https:)?\/\/c\.zmags\.com/g, '')
      },
   })
  })

  .match('/assets/images/:path*', ({ proxy, cache }) => {
    cache(CACHE_ASSETS)
    return proxy('zmags', { path: '/assets/images/' + ':path' })
  })

  .match('/assets/:path*', ({ proxy, cache }) => {
    cache(CACHE_ASSETS)
    return proxy('zmags', {
      transformResponse: (request) => {
        request.body = request.body
                        .toString()
                        .replace(/(https:)?\/\/images\.creator-prod\.zmags\.com/g, '/imageszmags')
                        .replace(/(https:)?\/\/www\.slumberland\.com/g, '')
                        .replace(/(https:)?\/\/c\.zmags\.com/g, '')
      },
   })
  })
  .match('/api/:path*', ({ proxy, cache }) => {
    cache(CACHE_ASSETS)
    return proxy('zmags', {
      transformResponse: (request) => {
        request.body = request.body
                        .toString()
                        .replace(/(https:)?\/\/images\.creator-prod\.zmags\.com/g, '/imageszmags')
                        .replace(/(https:)?\/\/www\.slumberland\.com/g, '')
                        .replace(/(https:)?\/\/c\.zmags\.com/g, '')
      },
   })
  })
  .match('/imageszmags/:path*', ({ proxy, cache, setResponseHeader }) => {
    cache(CACHE_ASSETS)
    setResponseHeader('content-type', 'image/jpeg')
    return proxy('imageszmags', { path: ':path' })
  })
  
  .match('/dw/image/:path*', ({ cache }) => {
    cache(CACHE_ASSETS)
  })
  
  
  .match('/:path*', ({ proxy }) => {
    return proxy('origin')
  })
