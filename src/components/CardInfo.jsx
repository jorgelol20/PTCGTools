import React, { Fragment } from "react";
import './CardInfo.css'
const CardInfo = ({ cardInfo, setNewCardInfo }) => {
    return (
        <Fragment>
            <div className="cardInfoContainer" onClick={(event)=>{
                if(event.target.classList.contains("cardInfoContainer")){
                    setNewCardInfo(null);
                }
            }}>
                <div className="cardInfo">
                    <button onClick={() => { setNewCardInfo(null) }}>X</button>
                    <div className="info">
                        <h1 id="cardName">{cardInfo.name}</h1>
                        <div id="cardImage">
                            <label htmlFor="card" className="quantity">{cardInfo.quantity}</label>
                            {
                                cardInfo.image ?
                                    <img
                                        src={cardInfo.image.replace('low','high')}
                                        onError={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = Placeholder;
                                        }}
                                        alt={cardInfo.name}
                                    />
                                    : <img
                                        src={selectImage(cardInfo.name)}
                                        alt={cardInfo.name} />
                            }
                        </div>
                        {
                            cardInfo.expansion && <div id="setInfo">
                                <h1>Set: {cardInfo.expansion}</h1>
                                <h1>ID: {cardInfo.cardNumber}</h1>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default CardInfo;