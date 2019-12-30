import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'


class LearningRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWord: {}
    }
  }

  static contextType = UserContext;

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language/head`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(e => Promise.reject(e));
      }
      return res.json();
    })
    .then(res => {
      this.setState({currentWord: res});
    })
  }

  render() {
    if (this.state.currentWord.nextWord === undefined){
      return <p>Loading...</p>
    } else {
      return (
        <main>
          <h2>Translate the word:</h2>
          <span>{this.state.currentWord.nextWord}</span>
          <p>Your total score is: {this.state.currentWord.totalScore}</p>
          <p>You have answered this word correctly {this.state.currentWord.wordCorrectCount} times.</p>
          <p>You have answered this word incorrectly {this.state.currentWord.wordIncorrectCount} times.</p>
          <form>
            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
            <input type='text' name='learn-guess-input' id='learn-guess-input' required></input>
            <button type='submit'>Submit your answer</button>
          </form>
        </main>
      );
    }

  }
}

export default LearningRoute
