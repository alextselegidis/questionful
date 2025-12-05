/* ----------------------------------------------------------------------------
 * Questionful - Questionnaires Made Simple
 *
 * @package     Questionful
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) Alex Tselegidis
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        https://questionful.org
 * @since       v1.0.x
 * ---------------------------------------------------------------------------- */

import React from 'react';
import './ProgressBox.css';

function ProgressBox({state}) {
    const totalQuestions = state.config.questions.length;

    const index = state.question ? state.currentQuestionIndex + 1 : totalQuestions;

    const style = {
        color: state.config.styles.secondaryFontColor,
    };

    return (
        <div className="ProgressBox" style={style}>
            <h1>
                Question <strong>{index}</strong> of <strong>{totalQuestions}</strong>
            </h1>
        </div>
    );
}

export default ProgressBox;
