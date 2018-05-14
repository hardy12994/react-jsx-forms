import React, { Component } from 'react';
import _ from 'underscore';
import { fromEvent, Subject } from 'rxjs';
import { FieldProperties } from './field-properties';


let form = {
    fields: {},
    valid: true,
    value: {},
    valueChanges: new Subject()
};


export class Forms extends Component {

    // GET FORM DATA  
    static retriveForm(fieldId = null) {
        return fieldId ? form.fields[fieldId] : form;
    }


    constructor(props) {
        super(props);
        this.whenFormUpdate = new Subject();
        this.reactInputs = this.filterInputFields(this.props.children);
    }

    componentDidMount() {
        this.wrapEvents();
        this.constructFormFields(this.props.fields);
    }


    // contricting fields with default values in form
    constructFormFields(fields) {

        for (const key in fields) {

            let field = new FieldProperties(key, fields[key].value, fields[key].validations,
                fields[key].error, false, false, fields[key].valid);

            form.fields[key] = field;
        }
        this.triggreDefaultForm();
    }



    // geting default form at first
    triggreDefaultForm() {
        this.executeFromMechanism();
    }


    filterInputFields(children = []) {
        return _.filter(children, item => item.type === 'input');
    }


    // Execute Validations
    executeValidations(fieldData, event) {

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

    // Field VALID / INVALID
    checkFieldValidity(fieldData) {

        if (_.isEmpty(fieldData.error)) {
            fieldData.valid = true;
            return;
        }

        for (const key in fieldData.error) {
            if (fieldData.error[key]) {
                fieldData.valid = false;
                form.valid = false;
                return;
            }
        }
        fieldData.valid = true;
        return;
    }

    // Form VALID / INVALID
    checkFormValidity() {

        for (const key in form.fields) {
            if (!form.fields[key].valid) {
                form.valid = false;
                return;
            }
        }
        form.valid = true;
    }

    // Exectute for perticular field
    executeFieldMechanism(inputId, event) {

        form.value[inputId] = event.target.value;

        // run validators
        // set Errors Errors
        this.executeValidations(form.fields[inputId], event);

        // set valid or not
        this.checkFieldValidity(form.fields[inputId]);

        this.checkFormValidity();
        form.valueChanges.next(form);
        form.fields[inputId].valueChanges.next(form.fields[inputId]);
    }

    // Exectute for FORM
    executeFromMechanism() {

        for (const key in form.fields) {


            form.value[key] = form.fields[key].value;
            // run validators
            // set Errors Errors
            this.executeValidations(form.fields[key], {
                target: {
                    value: form.fields[key].value
                }
            });

            // set valid or not
            this.checkFieldValidity(form.fields[key]);

        }
        this.checkFormValidity();
        form.valueChanges.next(form);
    }



    // for deactivation    
    deactivateKeyDownEvent(observable) {
        observable.unsubscribe();
    }

    // for deactivation
    deactivateFocusEvent(observable) {
        observable.unsubscribe();
    }

    wrapEvents() {

        let that = this;
        _.each(this.reactInputs, inp => {

            var input = document.querySelector(`#${inp.props.id}`);

            let focusEvent = fromEvent(input, 'blur')
                .subscribe(event => {
                    let inputId = inp.props.id;

                    form.fields[inputId].touched = true;
                    that.executeFieldMechanism(inputId, event);

                    // unsubscribe it
                    that.deactivateFocusEvent(focusEvent);

                });

            let keyDownEvent = fromEvent(input, 'keydown')
                .subscribe(event => {
                    let inputId = inp.props.id;

                    form.fields[inputId].dirty = true;

                    // unsubscribe it
                    that.deactivateKeyDownEvent(keyDownEvent);
                });

            fromEvent(input, 'keyup')
                .subscribe(event => {

                    let inputId = inp.props.id;

                    form.fields[inputId].value = event.target.value;
                    form.value[inputId] = event.target.value;

                    that.executeFieldMechanism(inputId, event);

                });

        });

    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
