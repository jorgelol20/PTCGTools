import React, { Fragment } from 'react';
import Card from './Card';
import CardInfo from './CardInfo';
import './Hand.css';
import { useState } from 'react';
const Hand = ({ hand }) => {

    const [actualCardInfo, setActualCard] = useState(null);

    const setNewCardInfo = (newCardInfo) => {
        setActualCard(newCardInfo);
    }


    return (
        <Fragment>
            <div className='hand'>
                <div id='header'>
                    <h1><label style={hand.isMulligan ? { color: 'red' } : { color: 'green' }}>{hand.isMulligan ? "Mulligan" : "No mulligan"}</label></h1>
                </div>
                <div className='cards'>
                    {
                        hand.hand.map((card) => {
                            card.quantity = 1;
                            return <Card
                                className="card"
                                loading="lazy"
                                key={Math.random().toString(36).substring(2, 15)}
                                cardInfo={card}
                                setNewCardInfo={setNewCardInfo}
                                showButtons={false}
                            />
                        })
                    }
                </div>
                <div className='cardInfo'>
                    {
                        actualCardInfo !== null && <CardInfo cardInfo={actualCardInfo} setNewCardInfo={setNewCardInfo} />
                    }
                </div>
            </div>
        </Fragment>
    );
}
export default Hand;