import React, { Component } from 'react';
import { forms } from '../core-data/formData';
import wrapEvents from '../events';


export class Forms extends Component {

    // GET FORM DATA
    static retriveForm(formId) {
        return formId ? forms[formId] : forms;
    }

    constructor(props) {
        super(props);
        if (!this.props.id) {
            throw new Error('form id is required');
        }
    }

    componentDidMount() {
        //wrapping all events for this form
        wrapEvents(this.props.id);
    }

    render() {
        return (
            <form {...this.props}></form>
        );
    }
}