import React, { Fragment, useState, useEffect } from "react";
import Hand from "./Hand";
import './HandContainer.css';
import Loading from "./Loading";
import { useTranslation } from "react-i18next";

const HandContainer = ({ hands }) => {
    const [display, setDisplay] = useState(false);
    const [loadedHands, setLoadedHands] = useState(undefined);
    const { t, i18n } = useTranslation();
    const loadHands = (hands) => {
        setTimeout(() => {
            let returnHands = [];
            let maxHands = 100;
            if (hands.length < 100) {
                returnHands = hands;
            } else {
                returnHands = hands.splice(0, maxHands);
            }

            setLoadedHands(returnHands);
        }, 1)
    }
    return (
        <Fragment>
            <div className="container">
                <button onClick={() => {
                    setDisplay(prev => !prev)
                }}>
                    {display ? t('hideHands') : hands.length > 10 ? t('showFirstHands') : t('showHands')}
                </button>
                {
                    display && loadedHands === undefined && <Loading />
                }
                {
                    display && loadedHands === undefined && loadHands(hands)
                }
                <div className="hands">
                    {
                        display && loadedHands !== undefined && loadedHands.map((hand,index) => {
                            return <Hand
                                key={Date.now() * index}
                                hand={hand}
                            />
                        })
                    }
                </div>
                {
                    display &&
                    loadedHands !== undefined &&
                    <button
                        className="upButton"
                        onClick={() => {
                            document.querySelector(".container").scrollIntoView({
                                behavior: 'smooth', block: "start", alignToTop: "true"
                            })
                        }}>1º</button>
                }
            </div>
        </Fragment>
    )
}
export default HandContainer;