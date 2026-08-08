import React, { Fragment } from "react";
import './Advice.css';
import { useTranslation } from "react-i18next";
const Advice = ({text,type}) => {
    const {t, i18n} = useTranslation();
    return(
        <Fragment>
            <div className="advice">
                <p className={type}><strong>{t('adviceTextTitle')}<br/></strong>{text}</p>
            </div>
        </Fragment>
    );   
}
export default Advice;