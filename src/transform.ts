import cheerio from 'cheerio'
import fetch from 'node-fetch'
var os = require("os");

// const fetch = require('node-fetch')

export default async function transform(response) {
  const $ = cheerio.load(response.body)

  // Adding the scripts that have the service worker among other things to enable prefetching for the PoC
  // In production, this will replaced by adding the scripts at the origin
  $('head').append(`
    <script src="/__layer0__/cache-manifest.js" defer="defer"></script>
    <script src="/main.js" defer="defer"></script>
  `)
  
  // $('#main .max-container').eq(0).attr('style', 'min-height: 100vh')

  // Fetching the home hero image url and putting it on top of the page, while the real image is still loading
  // hardcoding the api fetches to the demo domain
  const dataGroupId = $('#main').eq(0).find('.zmags-viewer-container').eq(0).attr('data-group')
  
  if (dataGroupId) {
    const resDataGroup = await fetch(`https://demos-slumberland-default.moovweb-edge.io/api/groups/${dataGroupId}`)
    const jsonDataGroup = await resDataGroup.json()
    var experienceId = false;
    jsonDataGroup.entries.map((entrie) => {
      if (entrie.value && entrie.value.threshold == 0) {
        experienceId = entrie.reference.resourceId
      }
    })
    if (experienceId) {
      const resExperience = await fetch(`https://demos-slumberland-default.moovweb-edge.io/api/experiences/${experienceId}`)
      const jsonExperience = await resExperience.json()
      var imageId = jsonExperience.scenes[0].widgets[0].imageId

      if ($('.pt_product-search-result').length) {
        imageId += '_480x320'
      }
      // console.log(`adding image with src='+/assets/images/"${imageId}".jpeg'`)
      $('#main').eq(0).find('.zmags-viewer-container').eq(0).prepend(`<img class="mw-home-hero" src="/assets/images/${imageId}.jpeg"/>`)
    }
  }

  $('img[src^="https://www.slumberland.com"]').each(function() {
    var url = $(this).attr('src');
    if (url) {
      $( this ).attr('src', url.replace('https://www.slumberland.com','').replace('http://www.slumberland.com',''))
    }
  });

  // disable lazy loading for first 2 thumblinks
  $('.thumb-link img').map((i, img) => {
    if (i<2) {
      $(img).attr('src', $(img).attr('data-src'))
    }
  })

  response.body = $.html()
    .replace(/(https:)?\/\/www\.slumberland\.com/g, '')
    .replace(/(https:)?\/\/c\.zmags\.com/g, '')
  }
