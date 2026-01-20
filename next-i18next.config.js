module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja'],
    localeDetection: false,
  },
  defaultNS:'common',
  ns:['common','profile','navigate','preloading'],
  react: { useSuspense: false }
  // reloadOnPrerender: process.env.NODE_ENV === 'development',
  // localeDetection:false,
  // reloadOnPrerender: false,
  // strictMode:true
};
