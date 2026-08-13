import React, { Fragment } from "react";
import './CardInfo.css'
import Placeholder from './../assets/img/placeHolder.png';
import CMAvg from './../assets/img/CM-Avg.webp';
import CMLow from './../assets/img/CM-Low.webp';
import TPAvg from './../assets/img/TP-Avg.webp';
import TPLow from './../assets/img/TP-Low.webp';
import SpainFlag from './../assets/img/Flag-Spain.png';
import USAFlag from './../assets/img/Flag-USA.png';

const CardInfo = ({ cardInfo, setNewCardInfo }) => {
    return (
        <Fragment>
            <div className="cardInfoContainer" onClick={(event) => {
                if (event.target.classList.contains("cardInfoContainer")) {
                    setNewCardInfo(null);
                }
            }}>
                <div className="cardInfoModal">
                    <button onClick={() => { setNewCardInfo(null) }}>X</button>
                    <div className="info">
                        <h1 id="cardName">{cardInfo.name}</h1>
                        <div className="card-body">
                            <div id="cardImage">
                                <label htmlFor="card" className="quantity">{cardInfo.quantity}</label>
                                <img className="languaje-icon" src={cardInfo.language == 'es' ? SpainFlag : USAFlag} alt="" />
                                {
                                    cardInfo.image ?
                                        <img
                                            src={cardInfo.image.replace('low', 'high')}
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
                                    <div className="prices">
                                        <div>
                                            <h2><img className="price-icon" src={CMAvg} alt="Cardmarket Average Price" /> {isNaN(cardInfo.avgCMPrice) ? '-' : cardInfo.avgCMPrice}€</h2>
                                            <h2><img className="price-icon" src={CMLow} alt="Cardmarket Low Price" /> {isNaN(cardInfo.lowCMPrice) ? '-' : cardInfo.lowCMPrice}€</h2>
                                        </div>
                                        <div>
                                            <h2><img className="price-icon" src={TPAvg} alt="TCGPlayer Average Price" /> {isNaN(cardInfo.avgTPPrice) ? '-' : cardInfo.avgTPPrice}$</h2>
                                            <h2><img className="price-icon" src={TPLow} alt="TCGPlayer Lower Price" /> {isNaN(cardInfo.lowTPPrice) ? '-' : cardInfo.lowTPPrice}$</h2>
                                        </div>

                                    </div>
                                    <div className="card-links">
                                        <a target="_blank" href={`https://www.cardmarket.com/Pokemon/Products?idProduct=${cardInfo.productIdCM}`}>Cardmarket link</a>
                                        <a target="_blank" href={`https://www.tcgplayer.com/product/${cardInfo.productIdTPP}`}>TCGPlayer link</a>
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default CardInfo;