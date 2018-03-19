import React, {Component} from 'react';
import './ProgressBox.css';

class ProgressBox extends Component {
    render() {
        const index = !this.props.state.question ? this.props.state.currentQuestionIndex : this.props.state.currentQuestionIndex + 1;

        return (
            <div className="ProgressBox">
                <h1>Question {index} of {this.props.state.config.questions.length}</h1>
            </div>
        )
    }
}

export default ProgressBox;