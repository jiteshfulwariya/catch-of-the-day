import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAoNXzikxDKsGDLuSzoC0a7OYbvwMwqBjs",
    authDomain: "catch-of-the-day-4c4f0.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-4c4f0.firebaseio.com",
};

const base = firebase.initializeApp(config)
// const base = Rebase.createClass(app.database())

export default base;