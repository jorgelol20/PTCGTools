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
                    <div className="title">
                        <h1>{t('mainTitle')}</h1>
                        <h3 id="subtitle">{t('welcome-subtitle')}</h3>
                    </div>
                    <h2>{t("welcome-howItWorks")}</h2>
                    <ol>
                        <li>{t("welcome-step1")}</li>
                        <li>{t("welcome-step2")}</li>
                        <li>{t("welcome-step3")}</li>
                    </ol>
                    <div className="bottonToAction">
                        <h3>{t("welcome-startToCalc")}</h3>
                        <NavLink key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)} id='calc' to="/calc" >{t('welcome-goToCalc')}</NavLink>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}
export default Welcome;