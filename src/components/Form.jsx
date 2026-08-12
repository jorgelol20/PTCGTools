import React, { Fragment, useRef, useState, useEffect, useContext } from 'react';
import './Form.css';
import { cardsContext } from '../context/CardProvider.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';
import Advice from './structure/Advice.jsx';
import { useTranslation } from 'react-i18next';
import { parseDeckList } from './../utils/parseDeckList';

const Form = ({ setNewDeck }) => {
    const { t, i18n } = useTranslation();
    const listRef = useRef(null);
    const { setNewError } = useContext(errorContext);
    /**
     * 
     */
    const formatCardList = () => {
        const formatedCardList = parseDeckList(listRef.current.value);
        setNewDeck(formatedCardList);
        if (formatedCardList.includes(null) || formatedCardList.includes(undefined) || formatedCardList.length == 0) {
            setNewError(t('errorFormat'));
        }
        setNewDeck(formatedCardList);
    }


    const baseFunction = () => {
        try {
            formatCardList();
        } catch (error) {
            setNewDeck(error.message);
        }
    }
    /**
     * 
     */
    return (
        <Fragment>
            <div className='adviceBox'>
                {
                    i18n.language == "es" && <Advice text={"Algunas expansiones más antiguas no están disponibles aún en español. Las cartas en el formato estándard funcionan sin ningún problema. Se recomienda el uso del idioma inglés si vas a hacer uso de cartas del formato 'Expandido'. Disculpar las molestias"} type={"importante"} />
                }
            </div>
            <form className='deckForm' id='deckForm'>
                <div>
                    <h3>Deck list</h3>
                    <textarea
                        autoFocus
                        spellCheck="false"
                        wrap='soft'
                        form='deckForm'
                        ref={listRef}
                        name="deckList"
                        id="deckList"
                        placeholder={t('textArea')}
                    />
                    <input
                        type="submit"
                        value={t('checkButton')}
                        onClick={(event) => {
                            event.preventDefault();
                            baseFunction();
                        }} />
                </div>
            </form>
        </Fragment>
    )
}
export default Form;