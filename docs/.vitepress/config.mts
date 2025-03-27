import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GridDB",
  description: "Documentation for GridDB.net",
  head: [
    [
      'link',
      { rel: 'icon', href: '/favicon.ico' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }
    ]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    jp: {
      label: 'Japanese',
      lang: 'jp',
      link: '/jp/'
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Download', link: 'https://griddb.net/en/downloads' },
    ],

    sidebar: {

      '/': [
        {
          text: 'About GridDB',
          collapsed: true,
          items: [
            {text: 'What is GridDB', link: '/about/'},
            {text: 'What is a Time Series Database', link: '/about/what-is-time-series-database'},
            {text: 'Release Notes', link: '/about/release-notes'},
            {text: 'FAQs', link: '/about/faq'},
          ]
        },
        {
          text: 'Installation',
          collapsed: true,
          items: [
            { text: 'Ubuntu', link: '/installation/ubuntu' },
            { text: 'Rocky Linux', link: '/installation/rocky-linux' },
            { text: 'Docker', link: '/installation/docker' },
            { text: 'Misc (WSL, ChromeOS)', link: '/installation/misc' }
          ]
        },
        {
          text: 'Getting Started',
          collapsed: true,
          items: [
            { text: 'Web CLI (No Install)', link: '/gettingstarted/webshell' },
            { text: 'Web API', link: 'https://griddb.net/en/blog/griddb-webapi/'},
            { text: 'GridDB CLI', link: 'https://griddb.net/en/blog/griddb-community-edition-v4-6-new-features/'},
            {
              text: 'Build an App', 
              items: [
                { text: 'Java', link: '/gettingstarted/java'},
                { text: 'Python', link: '/gettingstarted/python'},
                { text: 'Nodejs', link: '/gettingstarted/nodejs'},
                { text: 'Golang', link: '/gettingstarted/go'},
                { text: 'PHP', link: '/gettingstarted/php'},
              ]
            }
          ]
        },
        {
          text: 'Architecture',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/architecture/'},
            { text: 'Structure of GridDB', link: '/architecture/structure-of-griddb'},
            { text: 'Data Model', link: '/architecture/data-model'},
            { text: 'Database Functions', link: '/architecture/database-function'},
            { text: 'Operting Functions', link: '/architecture/operating-function'},
            { text: 'Parameters', link: '/architecture/parameter'},
          ]
        },
        {
          text: 'SQL Reference', 
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/sqlreference/'},
            { text: 'SQL Description Format', link: '/sqlreference/sql-description-format'},
            { text: 'SQL Commands Supported', link: '/sqlreference/sql-commands-supported'},
            { text: 'Metatables', link: '/sqlreference/metatables'},
            { text: 'Reserved Words', link: '/sqlreference/reserved-words'},
            { text: 'SQL Reference', link: '/sqlreference/SQL-Reference'}
          ]
        },
        {
          text: 'TQL Reference',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/tqlreference/' },
            { text: 'Type', link: '/tqlreference/type' },
            { text: 'TQL Syntax and Caluclation Functions', link: '/tqlreference/tql-syntax-and-calculation-functions' },
            { text: 'Annex', link: '/tqlreference/annex' },
            { text: 'TQL Reference', link: '/sqlreference/TQL-Reference'}
          ]
        },
        {
          text: 'Tutorial', 
          collapsed: true,
          items: [
            { text: 'Wide vs. Narrow Data Tables', link: '/tutorial/wide-narrow'},
            { text: 'ETL: With Apache Nifi', link: '/tutorial/nifi'},
            { text: 'Data Ingestion with Apache Kafka', link: '/tutorial/kafka'},
            { text: 'Querying IoT Dataset in Jupyter Notebook', link: '/tutorial/jupyter'},
            { text: 'Data Visualization using Apache Zeppelin', link: '/tutorial/pyspark'},
            { text: 'Forecasting Crime Complaints in NYCC using GridDB and Python StataModels', link: '/tutorial/forecasting'},
            { text: 'Using GridDB TimeSeries Expiration Functions', link: '/tutorial/timeseries-expiration'},
          ]
        },
        {
          text: 'JDBC Driver',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/jdbcdriver/'},
            { text: 'Overview', link: '/jdbcdriver/overview'},
            { text: 'Specifications', link: '/jdbcdriver/specifications'},
            { text: 'Sample', link: '/jdbcdriver/sample'},
          ]
        },
        {
          text: 'References',
          collapsed: true,
          items: [
            { text: 'API References', link: '/references/API-References'}
          ]
        }
      ],
      '/jp/': [
        {
          text: 'GridDBとは',
          collapsed: true,
          items: [
            {text: 'GridDBとは', link: '/jp/about/what-is-griddb'},
            {text: '時系列データベースとは', link: '/jp/about/what-is-time-series-database'},
            {text: 'リリースノート', link: '/jp/about/release-notes'},
            {text: 'FAQs', link: '/jp/about/faq'},
          ]
        },
        {
          text: 'Installation',
          collapsed: true,
          items: [
            
            { text: 'Ubuntu', link: '/jp/installation/ubuntu' },
            { text: 'Rocky Linux', link: '/jp/installation/rocky-linux' },
            { text: 'Docker', link: '/jp/installation/docker' },
            { text: 'Misc (WSL, ChromeOS)', link: '/jp/installation/misc' }
          ]
        },
        {
          text: 'はじめに',
          collapsed: true,
          items: [
            { text: 'Web CLI (No Install)', link: '/jp/gettingstarted/webshell' },
            { text: 'Web API', link: 'https://griddb.net/en/blog/griddb-webapi/'},
            { text: 'GridDB CLI', link: 'https://griddb.net/en/blog/griddb-community-edition-v4-6-new-features/'},
            {
              text: 'アプリ作成', 
              items: [
                { text: 'Java', link: '/jp/gettingstarted/java'},
                { text: 'Python', link: '/jp/gettingstarted/python'},
                { text: 'Nodejs', link: '/jp/gettingstarted/nodejs'},
                { text: 'Golang', link: '/jp/gettingstarted/go'},
                { text: 'PHP', link: '/jp/gettingstarted/php'},
              ]
            }
          ]
        },
        {
          text: 'アーキテクチャ',
          collapsed: true,
          items: [
            { text: 'はじめに', link: '/jp/architecture/'},
            { text: 'GridDBの仕組み', link: '/jp/architecture/structure-of-griddb'},
            { text: 'データモデル', link: '/jp/architecture/data-model'},
            { text: 'データベース機能', link: '/jp/architecture/database-function'},
            { text: '運用機能', link: '/jp/architecture/operating-function'},
            { text: 'パラメータ', link: '/jp/architecture/parameter'},
          ]
        },
        {
          text: 'SQL リファレンス', 
          collapsed: true,
          items: [
            { text: 'はじめに', link: '/jp/sqlreference/'},
            { text: 'SQL記述形式', link: '/jp/sqlreference/sql-description-format'},
            { text: 'サポートされるSQL文', link: '/jp/sqlreference/sql-commands-supported'},
            { text: 'メタテーブルとは', link: '/jp/sqlreference/metatables'},
            { text: '予約語', link: '/jp/sqlreference/reserved-words'},
            { text: 'SQL Reference', link: '/jp/sqlreference/SQL-Reference'}
          ]
        },
        {
          text: 'TQL リファレンス',
          collapsed: true,
          items: [
            { text: 'はじめに', link: '/jp/tqlreference/' },
            { text: 'データ型', link: '/jp/tqlreference/type' },
            { text: 'TQL構文・演算機能', link: '/jp/tqlreference/tql-syntax-and-calculation-functions' },
            { text: '付録', link: '/jp/tqlreference/annex' },
            { text: 'TQL Reference', link: '/jp/sqlreference/TQL-Reference'}
          ]
        },
        {
          text: 'JDBC ドライバ',
          collapsed: true,
          items: [
            { text: 'はじめに', link: '/jp/jdbcdriver/'},
            { text: '概要', link: '/jp/jdbcdriver/overview'},
            { text: '仕様', link: '/jp/jdbcdriver/specifications'},
            { text: 'サンプル', link: '/jp/jdbcdriver/sample'},
          ]
        },
        {
          text: 'リファレンス',
          collapsed: true,
          items: [
            { text: 'API References', link: '/jp/references/API-References'}
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
