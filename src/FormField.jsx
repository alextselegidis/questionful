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
import './QuestionBox.css';

/*
  FormField: renders a single question object from the JSON schema.

  Supported "type" values:
    - short_text
    - paragraph
    - dropdown
    - image
    - heading
    - text_block
    - multiple_choice
*/

export default function FormField({question, value, onChange}) {
    if (!question) return null;

    const type = question.type || 'short_text';

    const renderOptions = (options = []) =>
        options.map((opt, i) => (
            <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
            </option>
        ));

    switch (type) {
        case 'short_text':
            return (
                <input
                    type="text"
                    value={value ?? ''}
                    placeholder={question.placeholder ?? ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    aria-label={question.title || question.id}
                />
            );

        case 'paragraph':
            return (
                <textarea
                    rows={5}
                    value={value ?? ''}
                    placeholder={question.placeholder ?? ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    aria-label={question.title || question.id}
                />
            );

        case 'dropdown': {
            const opts = Array.isArray(question.options) ? question.options : [];
            return (
                <select
                    value={value ?? ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    aria-label={question.title || question.id}
                >
                    <option value="">{question.placeholder ?? 'Select an option'}</option>
                    {renderOptions(opts)}
                </select>
            );
        }

        case 'multiple_choice': {
            const opts = Array.isArray(question.options) ? question.options : [];
            const multiple = !!question.multiple;

            if (multiple) {
                const selected = Array.isArray(value) ? value : [];
                const toggle = (v) => {
                    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
                    onChange && onChange(next);
                };

                return (
                    <div className="multiple-choice">
                        {opts.map((opt, i) => {
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const label = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <label key={i}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(optValue)}
                                        onChange={() => toggle(optValue)}
                                    />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                );
            } else {
                return (
                    <div className="multiple-choice">
                        {opts.map((opt, i) => {
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const label = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name={question.id || `radio_${Math.random()}`}
                                        value={optValue}
                                        checked={value === optValue}
                                        onChange={() => onChange && onChange(optValue)}
                                    />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                );
            }
        }

        case 'text_block':
            return question.id === 'final_message' ? (
                <h3>{question.text} </h3>
            ) : (
                <p>{question.text ?? question.title ?? ''}</p>
            );

        default:
            return null;
    }
}
