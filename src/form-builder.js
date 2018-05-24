import _ from 'underscore';
import { Subject } from 'rxjs';
import { FieldProperties } from './field-properties';
import { forms, formSchema } from './forms';


//  For FORM Creation

export class FormBuilder {

    constructor(formId, fields) {

        forms[formId] = {
            id: formId,
            fields: fields,
            valid: true,
            value: {},
            // errors: {}, // TODO
            // validations: {}, //TODO
            valueChanges: new Subject()
        };
        FormBuilder.constructFormFields(formId, fields);

        return forms[formId];
    }


    // contricting fields with default values in form
    static constructFormFields(formId, fields) {

        for (const key in fields) {

            let field = new FieldProperties(key, formId, fields[key].value, fields[key].validations,
                fields[key].error, false, false, fields[key].valid);

            forms[formId].fields[key] = field;
        }
        FormBuilder.constructForm(formId);
    }


    /***************** 
    ***** FORM *******
    *******************/

    // Exectute for FORM
    static constructForm(formId) {

        let formData = forms[formId];
        let formFields = formData.fields;

        for (const key in formFields) {

            formData.value[key] = formFields[key].value;

            // run validators
            // set Errors Errors
            FormBuilder.updateFieldValidations(formFields[key], {
                target: {
                    value: formFields[key].value
                }
            });

            // set valid or not
            FormBuilder.updateFieldValidity(formFields[key]);
        }

        FormBuilder.updateFormValidity(formId);

        formData.valueChanges.next(formData);
    }


    /***************** 
    ***** FIELD *******
    *******************/

    // Execute Validations
    static updateFieldValidations(fieldData, event) {

        if (fieldData.validations.length === 0) {
            fieldData.error = {};
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
    ***** FIELD *******
    *******************/

    // Field VALID / INVALID
    static updateFieldValidity(fieldData) {

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
    ***** FORM *******
    *******************/

    // Form VALID / INVALID
    static updateFormValidity(formId) {

        let formFields = forms[formId].fields;

        for (const key in formFields) {
            if (!formFields[key].valid) {
                forms[formId].valid = false;
                return;
            }
        }
        forms[formId].valid = true;
    }
}
