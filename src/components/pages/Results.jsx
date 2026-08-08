import React, { Fragment, useContext, useEffect, useState } from 'react';
import { cardsContext } from '../../context/CardProvider';
import { NavLink } from 'react-router-dom';
import lodash from 'lodash';
import Loading from '../Loading.jsx';
import HandContainer from '../HandContainer.jsx';
import GraphMulligans from '../GraphMulligans.jsx';
import GraphCards from '../GraphCards.jsx';
import './Results.css';
import { useTranslation } from 'react-i18next';


const Results = () => {
    const { contextDeck, contextNumberOfHands: numberOfHands } = useContext(cardsContext);
    const [loading, setLoading] = useState(true);
    const [hands, setHands] = useState([]);
    const [results, setResults] = useState(undefined);
    const [numberOfMulligans, setNumberOfMulligans] = useState(0);
    const [display, setDisplay] = useState(false);
    const { t, i18n } = useTranslation();


    if (contextDeck === undefined || contextDeck.length == 0) {
        return (
            <Fragment>
                <h1>{t("errorResultsTitle")}</h1>
                <NavLink id='calc' to='/'>{t('backTitle')}</NavLink>
            </Fragment>
        )
    }

    const calculate = async () => {
        let tempHands = [];

        let cards = [];
        for (let card of contextDeck) {
            const qty = Number(card.quantity) || 1;
            for (let i = 0; i < qty; i++) {
                cards.push({ ...card, appears: 0 });
            }
        }

        const appearancesMap = new Map();
        contextDeck.forEach((card) => {
            const key = card.cardId || card.name;
            appearancesMap.set(key, { ...card, appears: 0 });
        });

        // 3. Simulación de robos
        for (let i = 0; i < numberOfHands; i++) {
            cards = lodash.shuffle(cards);
            let newHand = cards.slice(0, 7); // Roba 7 cartas

            let isMulligan = true;
            let uniqueCardsInHand = new Set();

            for (let card of newHand) {
                const isPokemon = card.cardType === "Pokémon" || card.cardType === "Pokemon";
                const isBasic = card.pokemonType === "Básico" || card.pokemonType === "Basic" || card.pokemonType === t('basic');

                if (isPokemon && isBasic) {
                    isMulligan = false;
                }

                const key = card.cardId || card.name;
                uniqueCardsInHand.add(key);
            }

            uniqueCardsInHand.forEach((key) => {
                if (appearancesMap.has(key)) {
                    appearancesMap.get(key).appears += 1;
                }
            });

            tempHands.push({
                "hand": newHand,
                "isMulligan": isMulligan
            });
        }

        let tempDeck = Array.from(appearancesMap.values());

        let tempNumberOfMulligans = tempHands.filter(hand => hand.isMulligan).length;

        setNumberOfMulligans(tempNumberOfMulligans);
        setHands(tempHands);
        setResults(tempDeck);
        setLoading(false);
    };


    useEffect(() => {
        async function tempFunction() {
            const timer = setTimeout(() => {
                calculate();
            }, 1000)
            return () => clearTimeout(timer);
        }
        tempFunction();
    }, [contextDeck])

    return (
        <Fragment>
            <NavLink key={Math.random().toString(36).substring(2, 15)} id='calc' to='/calc'>{t('backTitle')}</NavLink>
            <h1>{loading ? t('loadingResults') : t('resultsTitle')}</h1>
            <br />
            <div className='results'>
                <h1>{
                    loading && <Loading key={Math.random().toString(36).substring(2, 15)} />
                }</h1>

                <div className='finalResults'>
                    {
                        !loading && <button className='button' onClick={() => {
                            setDisplay(!display);
                        }}>
                            {display ? t('hideResults') : t('showResults')}
                        </button>
                    }
                    {
                        !loading && display &&
                        <div id='graphViwer' style={{ enabled: !display }}>
                            {/* Gráfico múlligans */}
                            <div id='mulligans'>
                                <GraphMulligans data={{ labels: ["Mulligans", "No mulligans"], datasets: [{ data: [numberOfMulligans, (numberOfHands - numberOfMulligans)], backgroundColor: ["red", "green"], borderColor: "black", borderWith: 2 }] }} />
                            </div>
                            {/* Gráfico cartas */}
                            <div id='cards'>
                                <GraphCards cards={results} numberOfHands={numberOfHands} />
                            </div>
                        </div>
                    }
                </div>
                {
                    !loading &&
                    <div id='handsViwer'>
                        <HandContainer
                            hands={hands}
                        />
                    </div>
                }

            </div>
        </Fragment>
    )
}
export default Results;