import React, { Component } from 'react';
import _ from 'underscore';
import { fromEvent, Subject } from 'rxjs';


export const formSchema = {
    id: '',
    fields: {},
    valid: true,
    value: {},
    // errors: {}, // TODO
    // validations: {}, //TODO
    valueChanges: new Subject()
};

export const forms = {}; // collection of formSchema


//  for Events trigger
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
        //wrapping all events
        this.wrapEvents();
    }


    /***************** 
     ***** FIELD ******
    *******************/

    // Execute Validations
    updateFieldValidations(fieldData, event) {

        if (fieldData.validations.length === 0) {
            fieldData.error = null;
            return;
        }
        if (!fieldData.error) {
            fieldData.error = {};
        }

        _.each(fieldData.validations, validator => {

            //dynamic
            if (!validator.isStatic) {
                let bool = validator.action(event);
                fieldData.error[validator.name] = bool;
                return;
            }

            let bool = validator.action(validator[validator.name], event);
            fieldData.error[validator.name] = bool;
        });
    }


    /***************** 
    ***** FIELD ******
   *******************/

    // Field VALID / INVALID
    updateFieldValidity(fieldData) {

        if (_.isEmpty(fieldData.error)) {
            fieldData.valid = true;
            return;
        }

        for (const key in fieldData.error) {
            if (fieldData.error[key]) {
                fieldData.valid = false;
                formSchema.valid = false;
                return;
            }
        }
        fieldData.valid = true;
        return;
    }


    /***************** 
    ***** FIELD ******
    *******************/

    // Exectute for perticular field
    updateField(inputId, event) {

        let formData = forms[this.props.id];

        // run validators
        // set Errors Errors
        this.updateFieldValidations(formData.fields[inputId], event);
        // set valid or not
        this.updateFieldValidity(formData.fields[inputId]);

        this.updateFormValidity();

        formData.valueChanges.next(forms);
        formData.fields[inputId].valueChanges.next(formData.fields[inputId]);
    }



    /***************** 
    ***** FORM *******
    *******************/

    // Form VALID / INVALID
    updateFormValidity() {

        let formFields = forms[this.props.id].fields;

        for (const key in formFields) {
            if (!formFields[key].valid) {
                forms[this.props.id].valid = false;
                return;
            }
        }
        forms[this.props.id].valid = true;
    }

    executeEvents(input, field) {
        let that = this;

        let focusEvent = fromEvent(input, 'blur')
            .subscribe(event => {
                // console.log('BLUR');

                let inputId = field;
                let isFocused = forms[this.props.id].fields[inputId].eventsTrigger.focusEvent;

                if (isFocused) {
                    return that.deactivateEvent(focusEvent);
                }

                forms[this.props.id].fields[inputId].touched = true;
                that.updateField(inputId, event);

                // unsubscribe it
                that.deactivateEvent(focusEvent);
                forms[this.props.id].fields[inputId].eventsTrigger.focusEvent = true;
            });

        let keyDownEvent = fromEvent(input, 'keydown')
            .subscribe(event => {
                // console.log('KEYDOWN');

                let inputId = field;
                let isKeyDown = forms[this.props.id].fields[inputId].eventsTrigger.keyDownEvent;

                if (isKeyDown) {
                    return that.deactivateEvent(keyDownEvent);
                }


                forms[this.props.id].fields[inputId].dirty = true;

                // unsubscribe it
                that.deactivateEvent(keyDownEvent);
                forms[this.props.id].fields[inputId].eventsTrigger.keyDownEvent = true;

            });



        let clickEvent = fromEvent(input, 'click')
            .subscribe(event => {

                // console.log('click');

                let inputId = field;
                let isClicked = forms[this.props.id].fields[inputId].eventsTrigger.clickEvent;

                if (isClicked ||
                    event.target.type === 'text' ||
                    event.target.type === 'password') {
                    return that.deactivateEvent(clickEvent);
                }


                forms[this.props.id].fields[inputId].dirty = true;

                // unsubscribe it
                that.deactivateEvent(clickEvent);
                forms[this.props.id].fields[inputId].eventsTrigger.clickEvent = true;

            });


        /** 
         * @description THIS WORK WILL BE DONE BY ONCHANGE EVENT PRESENT ON FIELD
        */

        // let keyEvent = fromEvent(input, 'keyup')
        //     .subscribe(event => {
        //         console.log('KEYUP');

        //         let inputId = field;

        //         // forms[that.props.id].fields[inputId].dirty = true;
        //         forms[that.props.id].fields[inputId].value = event.target.value;
        //         forms[that.props.id].value[inputId] = event.target.value;

        //         that.updateField(inputId, event);
        //         forms[this.props.id].fields[inputId].eventsTrigger.keyUpEvent = true;

        //     });
    }

    // for deactivation    
    deactivateEvent(observable) {
        observable.unsubscribe();
    }

    wrapEvents() {

        for (const field in forms[this.props.id].fields) {

            var input = document.querySelector(`#${field}`); // by ID

            if (!input) {

                var sameNameInputs = document.querySelectorAll(`input[name=${field}]`);

                for (let index = 0; index < sameNameInputs.length; index++) {
                    if (sameNameInputs[index].form['id'] === this.props.id) {
                        this.executeEvents(sameNameInputs[index], field);
                    }
                }

                continue;
            }

            this.executeEvents(input, field);

        }

    }

    render() {
        return (
            <form {...this.props}></form>
        );
    }
}