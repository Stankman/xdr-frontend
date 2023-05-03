export const environment = {
    production: false,
  
    app: {
      url: 'http://localhost:4200',
  
      version: '1.8.0',
  
      // API
      endpoint: 'http://localhost:9000',
  
      //WebSockets
      socketUrl: 'ws://localhost:2053',
  
      // Website
      hotelName: 'Habbo',
      title: '- Habbo',
  
      registerKey: 'test',
  
      // Images
      imager: 'https://habbo.com/habbo-imaging/avatarimage?figure=',
      badgeParts: '',
      album1584: 'http://localhost/assets/c_images/album1584/',
      guild_imager: 'http://localhost/assets/c_images/Badgeparts/generated/',
  
      camera: {
        images: '',
        thumbnails: '',
      },
  
      // Language
      defaultLang: 'en',
  
      //Formats
      dateFormat: 'dd.MM.yyyy',
      timeFormat: 'HH:mm',
  
      //Cache in seconds
      cacheTTL: 300,
  
      //Google Recaptcha
      siteKey: '6LcdYgsdAAAAADgKEU6Fwn4uDgXj40zOXHKiCS2r',
  
      //PayPal
      clientId: 'ARdkmL_-AOCos7Vx1Ivw3CP427-sDDmCLPBCha2okrN8eAADB_CiFU6akC0B-ZZ5QCI3QTjPeSPqWykY',
  
      //Adsense
      adClient: 'ca-pub-9330463230786581',
  
      maintenance: false,

      theme: 'dark'
    }
  };
  
  export const client = {
    flash: {
      enabled: true,
      source: 'http://localhost/flash/index.html',
      flashBrowser: 'https://github.com/asteroid-dev/FlashBrowser/releases/download/v1.0.0/FlashBrowser.exe'
    },
  
    nitro: {
      source: 'http://localhost/nitro-react/index.html'
    }
  };