import React, { Component } from 'react';
import './App.css';
import firebase from './config/firebase.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: []
    }
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items')
    itemsRef.on('value', (snapshot) => {
      //items is equal to the current value of 'items', referenced above
      let items = snapshot.val()
      //creating empty array to hold the items
      let newState = []
      //for each key in our items object
      for (let item in items) {
        //and it to our empty array
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        })
      }
      //update the state
      this.setState({
        items: newState
      })
    })
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit = (e) => {
    //to prevent refreshing the page we us preventDefault
    e.preventDefault()
    //to create space in our database where we'd like to store the items that 
    //people are bringing. 
    //Do this by calling the ref method and passing in the name of the object 
    //you'd like the items to be stored in.
    const itemsRef = firebase.database().ref('items')
    //setting up the data structure we'd like our items in the database to have
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    //adding them to the database using the ref we created above
    itemsRef.push(item)
    //resetting input fields
    this.setState({
      currentItem: '',
      username: ''
    })
  }
  //since each mapped item uses its item.id ("AsjnsaKBDUSBAksJANJSD214SjbKa" or something)
  //we can reference that id to remove it
  removeItem = (itemId) => {
    const itemRef = firebase.database().ref(`/items/${itemId}`)
    itemRef.remove()
  }
  render() {
    //mapping over our state of items and returning a display card for each
    const items = this.state.items.map(item => {
      return (
        <li key={item.id}>
          <h3>{item.title}</h3>
          <p>brought by: {item.user}</p>
          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
        </li>
      )
    })
    return (
      <div className='app'>
        <header>
          <div className='wrapper'>
            <h1>Fun Food Friends</h1>

          </div>
        </header>
        <div className='container'>
          <section className='add-item'>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="username" placeholder="What's your name?"
                onChange={this.handleChange} value={this.state.username} />
              <input type="text" name="currentItem" placeholder="What are you bringing?"
                onChange={this.handleChange} value={this.state.currentItem} />
              <button>Add Item</button>
            </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                {items}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
