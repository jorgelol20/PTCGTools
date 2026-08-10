import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import './Welcome.css';
import { NavLink } from "react-router-dom";

const Welcome = () => {
    const { t, i18n } = useTranslation();
    return (
        <Fragment>
            <main className="mainWelcome">
                <div className="mainContent">
                    <div className="menuContainer">
                        <div className="title">
                            <h1>{t('deckBuilder')}</h1>
                            <h3 id="subtitle">{t('builder-subtitle')}</h3>
                        </div>
                        <h2>{t("builder-howItWorks")}</h2>
                        <div className="bottonToAction">
                            <NavLink key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)} id='calc' to="/deck" >{t('builder-goToCreate')}</NavLink>
                        </div>
                    </div>
                    <div className="menuContainer">
                        <div className="title">
                            <h1>{t('mulliganCalculator')}</h1>
                            <h3 id="subtitle">{t('calculator-subtitle')}</h3>
                        </div>
                        <h2>{t("calculator-howItWorks")}</h2>
                        <ol>
                            <li>{t("calculator-step1")}</li>
                            <li>{t("calculator-step2")}</li>
                            <li>{t("calculator-step3")}</li>
                        </ol>
                        <div className="bottonToAction">
                            <h3>{t("welcome-startToCalc")}</h3>
                            <NavLink key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)} id='calc' to="/calc" >{t('welcome-goToCalc')}</NavLink>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}
export default Welcome;