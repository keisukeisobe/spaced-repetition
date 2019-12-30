import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'


class LearningRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWord: {},
      totalScore: '',
      correctCount: '',
      inCorrectCount: '',
      isCorrect: null,
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
      this.setState({currentWord: res, totalScore: res.totalScore, correctCount: res.correctCount, incorrectCount: res.incorrectCount, isCorrect: res.isCorrect});
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    //get user input
    const guess = event.target['learn-guess-input'].value;
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({guess, currentWord: this.state.currentWord.nextWord})
    }).then(res => {
      if(!res.ok) {
        return res.json().then(e => Promise.reject(e));
      }
      return res.json();
    })
        .then(res => {
          console.log(res);
          this.setState({totalScore: res.totalScore, correctCount: res.wordCorrectCount, incorrectCount: res.wordIncorrectCount});
        })
  };

  render() {
    if (false){
      return <p>Loading...</p>
    } else {
      return (
        <main>
          <h2>Translate the word:</h2>
          <span>{this.state.currentWord.nextWord}</span>
          <p>Your total score is: {this.state.currentWord.totalScore}</p>
          <p>You have answered this word correctly {this.state.currentWord.wordCorrectCount} times.</p>
          <p>You have answered this word incorrectly {this.state.currentWord.wordIncorrectCount} times.</p>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
            <input type='text' name='learn-guess-input' id='learn-guess-input' required/>
            <button type='submit'>Submit your answer</button>
          </form>
        </main>
      );
    }
  }
}

export default LearningRoute
