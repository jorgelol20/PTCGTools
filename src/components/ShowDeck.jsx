import React, { Fragment, useContext, useEffect, useState, useRef, act } from 'react';
import { NavLink } from 'react-router-dom';
import './ShowDeck.css';
import usePokeAPI from '../Hooks/usePokeAPI.js';
import { cardsContext } from '../context/CardProvider.jsx';
import Card from './Card.jsx';
import Loading from './Loading.jsx';
import Advice from './structure/Advice.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';
import { useTranslation } from 'react-i18next';
import CardInfo from "./CardInfo.jsx";

const ShowDeck = ({ deck }) => {
    const { deckAPI, loading } = usePokeAPI(deck);
    const { contextDeck, setContextDeck, setContextNumberOfHands } = useContext(cardsContext);
    const [cardQuantity, setCardQuantity] = useState(0);
    const [deckAvgPrice, setDeckAvgPrice] = useState(0);
    const [dolarsDeckAvgPrice, setDolarsDeckAvgPrice] = useState(0);
    const [deckLowPrice, setDeckLowPrice] = useState(0);
    const [dolarsDeckLowPrice, setDolarsDeckLowPrice] = useState(0);
    const [numberOfHands, setNumberOfHands] = useState(10);
    const { setNewError, badCards, resetBadCards } = useContext(errorContext);
    const numberOfHandsRef = useRef(null);
    const [actualCardInfo, setActualCard] = useState(null);
    const { t } = useTranslation();

    const redirectRoute = (e) => {
        if (cardQuantity !== 60) {
            const message = cardQuantity > 60
                ? "Hay más de 60 cartas, ¿estás seguro?"
                : "Hay menos de 60 cartas, ¿estás seguro?";

            if (!window.confirm(message)) {
                e.preventDefault();
                return;
            }
        }
    }
    const errorMessage = () => {
        let badCardsString = "";
        if (badCards !== undefined) {
            badCardsString = `${badCards}`;
        }
        setNewError(`${t('loadingError')}:  ${badCardsString}`);
        resetBadCards();
    }

    const setNewCardInfo = (newCardInfo) => {
        setActualCard(newCardInfo);
    }

    // Actualiza la cantidad de una carta de forma inmutable
    const handleUpdateQuantity = (cardToUpdate, cantidad) => {
        setContextDeck(prevDeck => {
            return prevDeck.map(card => {
                const isMatch = card.cardId ? card.cardId === cardToUpdate.cardId : card.name === cardToUpdate.name;
                if (isMatch) {
                    const currentQty = Number(card.quantity) || 0;
                    return { ...card, quantity: Math.max(0, currentQty + cantidad) };
                }
                return card;
            });
        });
    };

    const changePriceDolar = async (totalMinPrice = 0,totalAvgPrice = 0) => {
        setDolarsDeckLowPrice(await convert('EUR','USD',Number(totalMinPrice.toFixed(2))))
        setDolarsDeckAvgPrice(await convert('EUR','USD',Number(totalAvgPrice.toFixed(2))))
    }

    // Recalcula el total de cartas cuando contextDeck cambia
    useEffect(() => {
        if (contextDeck && contextDeck.length > 0) {
            const total = contextDeck.reduce((cont, card) => cont + (Number(card?.quantity) || 0), 0);
            const totalAvgPrice = contextDeck.reduce((cont, card) => cont + ((Number(card?.avgPrice) * Number(card?.quantity)) || 0), 0)
            const totalMinPrice = contextDeck.reduce((cont, card) => cont + ((Number(card?.lowPrice) * Number(card?.quantity)) || 0), 0)
            setCardQuantity(total);
            setDeckAvgPrice(Number(totalAvgPrice.toFixed(2)));
            setDeckLowPrice(Number(totalMinPrice.toFixed(2)));
            changePriceDolar(totalMinPrice,totalAvgPrice)

        } else {
            setCardQuantity(0);
            setDeckAvgPrice(0);
            setDeckLowPrice(0);
            changePriceDolar()

        }
    }, [contextDeck]);

    /**
     * Cuando detecta cambios en "deckAPI" (export de 'usePokeAPI.js'), realiza las siguientes acciones:
     * 1- Obtiene si han habido errores en alguna carta y muestra en qué líneas hay una carta "mala". Esto se le pasa al componente de mensaje de error y como "errorMessage";
     * 2- Settea el númeor de manos que por defecto es 10.
     * 3- Elimina todas las cartas inválidas (undefined) y las manda al contexto en un solo objeto.
     * Nota: Primero se comprueba si se ha setteado el 'deckAPI' o sigue siendo Undefined para realizar las acciones.
     */
    useEffect(() => {
        if (deckAPI !== undefined && deckAPI.length > 0) {
            if (deckAPI.includes(undefined)) {
                errorMessage();
            }
            setContextNumberOfHands(numberOfHands);
            setContextDeck(deckAPI.filter((card) => {
                return card !== undefined;
            }));
            const cards = deckAPI.reduce((acc, card) => card !== undefined ? acc + Number(card.quantity) : acc + 0, 0);
            setCardQuantity(cards);
        }
    }, [deckAPI])
    /**
     * Cuando el usuario cambia en el select el número de pruebas, el useEffect detecta el cambio y lo settea en el contexto.
     */
    useEffect(() => {
        if (numberOfHandsRef.current !== null) {
            setContextNumberOfHands(numberOfHandsRef.current.value);
        }
    }, [numberOfHandsRef])

    /* COMPROBACIONES Y CARGAS */
    //Comprobaciones básicas para saber si deben cargar los componentes
    //Si el deck del contexto no es undefined, no está vacío y tampoco están cargando las cartas: true 
    const load = contextDeck != undefined && contextDeck.length > 0 && !loading;

    //Cargar avisos si el número de manos es mayor a 100
    const advises = (numberOfHands) => {
        if (numberOfHands < 100) {
            return null;
        } else {
            return (
                <div className='advices'>
                    <Advice text={t('adviceText')} type={"aviso"} />
                    {
                        numberOfHands > 10000 && <Advice text={t('importantText')} type={"importante"} />
                    }
                </div>
            );
        }
    }
    async function convert(from, to, amount) {
        if(from === undefined){
            console.log()
            return 0
        }
        return await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
            .then((resp) => resp.json())
            .then((data) => {
                const convertedAmount = (amount * data.rates[to]).toFixed(2);
                console.log(convertedAmount)
                return convertedAmount
            });
    }
    //Return
    return (
        <Fragment>
            <section>
                <div className='deckInfo'>
                    <h1 id='title'> {t('cardListTitle')} (Total: <label style={cardQuantity != 60 ? { color: 'red' } : { color: 'green' }}> {cardQuantity} </label>)</h1>
                    <h1 id='title'>{t('avgPriceText')}: {deckAvgPrice}€ | {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(dolarsDeckAvgPrice)}</h1>
                    <h1 id='title'>{t('lowPriceText')}: {deckLowPrice}€ | {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(dolarsDeckLowPrice)}</h1>
                </div>
                {
                    /**
                     * 
                     */
                    load ?
                        cardQuantity > 7 ?
                            <NavLink key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)} id='calc' to="/results" onClick={redirectRoute} >{t('calcButton')} {numberOfHands}</NavLink>
                            : <div id='calc'>{t('minCardText')}</div>
                        : <></>
                }
                {
                    advises(numberOfHands)
                }
                {
                    /**
                     * 
                     */
                    load && cardQuantity > 7 && <div>
                        <h1 htmlFor="numberOfHands">{t('numberOfTestText')}  <select ref={numberOfHandsRef} className='numberOfHands' name="numberOfHands" id="numberOfHands" onChange={() => {
                            setContextNumberOfHands(numberOfHandsRef.current.value);
                            setNumberOfHands(numberOfHandsRef.current.value);
                        }}>
                            <option value="10">10</option>
                            <option value="100">100</option>
                            <option value="1000">1000</option>
                            <option value="10000">10000</option>
                            <option value="100000">100000</option>
                            <option value="1000000">1000000</option>
                            <option value="10000000">10000000</option>
                        </select>
                        </h1>
                    </div>
                }
                {
                    /**
                     * 
                     */
                    <div className='cards'>
                        {
                            loading && <Loading />
                        }
                        {
                            load ? contextDeck.map((card) => {
                                if (card !== undefined) {
                                    return <Card
                                        className="card"
                                        key={window.crypto ? crypto.randomUUID?.() : Math.random().toString(36).substring(2, 15)}
                                        cardInfo={card}
                                        setNewCardInfo={setNewCardInfo}
                                        onUpdateQuantity={handleUpdateQuantity}
                                    />
                                }

                            })
                                : ""
                        }
                    </div>
                }
                <div className='cardInfo'>
                    {
                        load && actualCardInfo !== null && <CardInfo cardInfo={actualCardInfo} setNewCardInfo={setNewCardInfo} />
                    }
                </div>
            </section>
        </Fragment>
    )
}
export default ShowDeck;