import React, { Fragment } from "react";
import LogoTCGDexAPI from './../../assets/img/logo-TCGDex.svg'
import './Footer.css';
import { useTranslation } from "react-i18next";
const Footer = () => {
    const {t, i18n} = useTranslation();
    return (
        <Fragment>
            <footer>
                <p>{t('createdBy')} <a href="https://github.com/jorgelol20">Jorge Colomer Albertos</a></p>
                <p>{t('copyright')}</p>
                <a href="https://tcgdex.dev/es"><img src={LogoTCGDexAPI} alt="Logo TCGDex"/></a>
            </footer>
        </Fragment>
    )
}
export default Footer;