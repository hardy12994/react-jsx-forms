import { FormGroupSchema, FieldSchema } from '../schemas';

import {
    updateFieldValidations,
    updateFieldValidity
} from '../updations/field-updations';



export class FormField {

    constructor(formId, fieldId, data) {
        return this.constructFormFields(formId, fieldId, data);
    }

    constructFormFields(formId, fieldId, data) {

        let field = new FieldSchema(fieldId, formId, data.value,
            data.validations, {}, false, false, true, null);


        // run validators
        // set Errors Errors
        updateFieldValidations(field, {
            target: {
                value: field.value
            }
        });

        // set valid or not
        updateFieldValidity(field);


        return field;

        // return {
        //     [fieldId]: data
        // };
    }

}