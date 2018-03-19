import React, {Component} from 'react';
import ProgressBox from './ProgressBox';
import QuestionBox from './QuestionBox';
import './App.css';

const config = require('./Questionrrr.json');

class App extends Component {
    state = {
        config: config,
        question: null,
        answers: [],
        message: 'test this',
        isLastQuestion: false,
        currentQuestionIndex: 0,
    };

    api = {
        showMessage: (message) => {
            this.setState({
                message
            });
        },
        updateState: (newState) => {
            this.setState(newState)
        }
    };

    componentWillMount() {
        if (!this.state.config) {
            this.api.showMessage('Error! No configuration provided.');
            return;
        }

        if (!this.state.question) {
            this.api.updateState({question: this.state.config.questions[0]});
        }
    }

    render() {
        const props = {
            state: this.state,
            api: this.api
        };

        const appStyle = {
            background: this.state.config.styles.backgroundColor,
            color: this.state.config.styles.fontColor,
            fontFamily: this.state.config.styles.fontFamily
        };

        const linkStyle = {
            color: this.state.config.styles.fontColor
        };

        return (
            <div className="App" style={appStyle}>
                <header>
                    <ProgressBox {...props} />
                </header>
                <em>{this.state.message}</em>
                <QuestionBox {...props} />
                <footer>
                    Copyright &copy; {(new Date()).getFullYear()}
                    &nbsp;-&nbsp;
                    <a href="http://alextselegidis.com" style={linkStyle}>Alex Tselegidis</a>
                </footer>
            </div>
        );
    }
}

export default App;
