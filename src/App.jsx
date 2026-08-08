import { useState, Fragment, Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom';
import Content from './components/pages/Content.jsx';
import CardProvider from './context/CardProvider.jsx';
import './App.css'
import ErrorProvider from './context/ErrorProvider.jsx';
import Footer from './components/structure/Footer.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import './i18n.js';
import { useTranslation } from 'react-i18next';
import SpainFlag from './assets/img/Flag-Spain.png';
import USAFlag from './assets/img/Flag-USA.png';


function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(()=>{
        i18n.language.includes("es") ? changeLanguage('es') : changeLanguage('en');
    },[])

  return (
    <>
      <Suspense fallback="Loading...">
        <SpeedInsights />
        <Analytics />
        <div className='app'>
          <header>
            <h1 id='mainTitle'><a href="/">{t('mainTitle')}</a></h1>
            <button className={i18n.language == "es" ? 'languajeButton active' : 'languajeButton'} onClick={() => changeLanguage("es")}><img src={SpainFlag} alt="Spain Flag" title='Spain Flag' /></button>
            <button className={i18n.language == "en" ? 'languajeButton active' : 'languajeButton'} onClick={() => changeLanguage("en")}><img src={USAFlag} alt="USA Flag" title='Spain Flag'/></button>
          </header>
          <BrowserRouter>
            <ErrorProvider>
              <CardProvider>
                <div className='content'>
                  <Content />
                </div>
                <Footer />
              </CardProvider>
            </ErrorProvider>
          </BrowserRouter>
        </div>
      </Suspense>
    </>
  )
}

export default App
