import React, {Component} from 'react';
import './ProgressBox.css';

class ProgressBox extends Component {
    render() {
        return (
            <div className="ProgressBox">
                <h1>Question {this.props.state.currentQuestionIndex} of {this.props.state.config.questions.length}</h1>
            </div>
        )
    }
}

export default ProgressBox;