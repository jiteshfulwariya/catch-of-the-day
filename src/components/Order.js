import React from 'react';
import { formatPrice } from '../helpers';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import PropTypes from 'prop-types';

class Order extends React.Component {

    constructor() {
        super();
    }
    renderOrder = (key) => {
        const fish = this.props.fishes[key];
        const count = this.props.order[key];
        const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

        if(!fish || fish.status === 'unavailable'){
            return (
                <CSSTransition timeout={500} classNames="order" key={key}>
                    <li key={key}>Sorry, {fish ? fish.name:'fish'} is no longer available{removeButton}</li>
                </CSSTransition>
            )
        }

        return (
            <CSSTransition timeout={500} classNames="order" key={key}>
                <li key={key}>
                    <span>
                        <TransitionGroup component="span" className="count">
                            <CSSTransition timeout={250} classNames="count" key={count}>
                                <span key={count}>{count}</span>
                            </CSSTransition>
                        </TransitionGroup>
                        lbs {fish.name} {removeButton}
                    </span>
                    <span className="price">{formatPrice(count*fish.price)}</span>
                </li>
            </CSSTransition>
        )
    }

    render() {
        const orderIds = Object.keys(this.props.order);
        const total = orderIds.reduce((prevTotal, key) => {
            const fish = this.props.fishes[key];
            const count = this.props.order[key];
            const isAvailable = fish && fish.status === 'available';
            if(isAvailable) {
                return prevTotal + (count*fish.price || 0);
            }
            return prevTotal;
        }, 0);

        return (
            <div className="order-wrap">
                <h2>Your Order</h2>
                <TransitionGroup  
                    className="order" 
                    component="ul"
                >
                    {orderIds.map(this.renderOrder)}
                    <CSSTransition timeout={500} classNames="order" key="total">
                        <li className="total">
                            <strong>Total:</strong>
                            {formatPrice(total)}
                        </li>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        );
    }
}

Order.propTypes = {
    fishes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    removeFromOrder: PropTypes.func.isRequired
};

export default Order;