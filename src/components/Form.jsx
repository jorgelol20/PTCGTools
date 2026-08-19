import React, { Fragment, useRef, useState, useEffect, useContext } from 'react';
import './Form.css';
import { cardsContext } from '../context/CardProvider.jsx';
import { errorContext } from '../context/ErrorProvider.jsx';
import Advice from './structure/Advice.jsx';
import { useTranslation } from 'react-i18next';
import { parseDeckList } from './../utils/parseDeckList';

const Form = () => {
    const { t, i18n } = useTranslation();
    const listRef = useRef(null);
    const { userDecks, addNewDeck, importDeckFromClipboard } = useContext(cardsContext);
    const { setNewError } = useContext(errorContext);




    const baseFunction = () => {
        try {
            importDeckFromClipboard(listRef.current.value)
        } catch (error) {
            importDeckFromClipboard(error.message);
        }
    }
    /**
     * 
     */
    return (
        <Fragment>
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