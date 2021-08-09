module.exports = {
  routes: './src/routes.ts',
  backends: {
    origin: {
      domainOrIp: 'www.slumberland.com',
      hostHeader: 'www.slumberland.com',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
    creator: {
      domainOrIp: 'creator.zmags.com',
      hostHeader: 'creator.zmags.com',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
    zmags: {
      domainOrIp: 'c.zmags.com',
      hostHeader: 'c.zmags.com',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
    imageszmags: {
      domainOrIp: 'images.creator-prod.zmags.com',
      hostHeader: 'images.creator-prod.zmags.com',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
  },
}
