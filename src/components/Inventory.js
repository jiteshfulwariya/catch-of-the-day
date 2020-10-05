import React from 'react';
import AddFishForm from './AddFishForm';
import PropTypes from 'prop-types';
import base from '../base'
import firebase from 'firebase';

class Inventory extends React.Component {
    constructor() {
        super();

        this.state = {
            uid: null,
            owner: null
        }
    }
    componentDidMount() {
        base.auth().onAuthStateChanged((user) => {
            if(user){
                this.authHandler({user});
            }
        });
    }

    handleChange = (e, key) => {
        const fish = this.props.fishes[key];

        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }

        this.props.updateFish(key, updatedFish);
    };

    authenticate = (providerText) => {
        let provider = null;
        if(providerText === 'facebook') {
            provider = new firebase.auth.FacebookAuthProvider();
        }else if(providerText === 'twitter'){
            provider = new firebase.auth.TwitterAuthProvider();
        }else{
            provider = new firebase.auth.GithubAuthProvider();
        }

        base.auth().signInWithPopup(provider)
            .then(this.authHandler)
            .catch((error) => {
                console.log(error);
            });
    };

    logout = () => {
        base.auth()
            .signOut()
            .then(() => {
                this.setState({ uid: null })
            })
            .catch((error) => {
                // An error happened
                console.log(error);
            });
    };

    authHandler = (authData) => {
        // console.log(authData);
        //grab the store info
        const storeRef = base.database().ref();
        //query the firbase once for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            if(!data.owner){
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
    };

    renderLogin = () => {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
                <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
            </nav>
        )
    };

    renderInventory = (key) => {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input type="text" name="name" value={fish.name} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Name"/>
                <input type="text" name="price" value={fish.price} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Price"/>
                <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea name="desc" value={fish.desc} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Desc"></textarea>
                <input type="text" name="image" value={fish.image} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Image"/>
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        );
    };

    render() {
        const logout = <button onClick={() => this.logout()}>Log Out!</button>
        //check if they are not logged in at all
        if(!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        //check if they are the owner
        // if(this.state.uid !== this.state.owner) {
        //     return (
        //         <div>
        //             <p>Sorry you aren't the owner of the store</p>
        //             {logout}
        //         </div>
        //     )
        // }
        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish = {this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }
}

Inventory.propTypes = {
    addFish: PropTypes.func.isRequired,
    updateFish: PropTypes.func.isRequired,
    removeFish: PropTypes.func.isRequired,
    loadSamples: PropTypes.func.isRequired,
    fishes: PropTypes.object.isRequired,
    storeId: PropTypes.string.isRequired
};

export default Inventory;