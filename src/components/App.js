import React from 'react';
import Header from './Header.js';
import Order from './Order';
import Inventory from './Inventory'; 
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import Rebase from 're-base';
import base from '../base';
import PropTypes from 'prop-types';

class App extends React.Component {
    constructor(){
        super();
        
        this.state = {
            fishes:{},
            order:{}
        };
    }

    componentWillMount() {
        // this runs before the App is rendered
        const baseObj = Rebase.createClass(base.database());
        this.ref = baseObj.syncState(`${this.props.match.params.storeId}/fishes`,{
            context: this,
            state: 'fishes'
        });

        // check if there are any order in localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);

        if(localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order));
    }

    addFish = (fish) => {
        const fishes = {...this.state.fishes};
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;

        this.setState({ fishes });
    };

    updateFish = (key, updatedFish) => {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;

        this.setState({ fishes });
    };

    removeFish = (key) => {
        const fishes = {...this.state.fishes};
        fishes[key] = null;

        this.setState({ fishes });
    };

    loadSamples = () => {
        this.setState({
            fishes: sampleFishes
        })
    };

    addToOrder = (key) => {
        const order = {...this.state.order};
        order[key] = order[key]+1 || 1;

        this.setState({ order });
    };

    removeFromOrder = (key) => {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    };

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes).map(key => 
                            <Fish 
                                key={key} 
                                details={this.state.fishes[key]} 
                                addToOrder={this.addToOrder} 
                                index={key}
                            />
                            )
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder}
                />
                <Inventory 
                    addFish = {this.addFish} 
                    loadSamples = {this.loadSamples} 
                    fishes={this.state.fishes} 
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    storeId={this.props.match.params.storeId}
                />
            </div>
        );
    }
}

App.propTypes = {
    match: PropTypes.object.isRequired
};

export default App
