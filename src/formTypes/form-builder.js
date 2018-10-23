import { forms } from '../core-data/formData';
import {
    updateFieldValidations,
    updateFieldValidity
} from '../updations/field-updations';
import { updateFormValidity } from '../updations/form-updations';
import { FormSchema, FieldSchema } from '../schemas';




//  For FORM Creation
export class FormBuilder {

    constructor(formId, fields) {

        this.constructFormFields(formId, fields);
        return forms[formId];
    }


    // contricting fields with default values in form
    constructFormFields(formId, fields) {

        let formSchema;

        if (!forms[formId]) {

            // father null
            formSchema = new FormSchema(formId);
            forms[formId] = formSchema;
        } else {
            // maintaining work for group and array -forms
            formSchema = forms[formId];
        }


        // console.log('form-builder', forms);


        for (const key in fields) {


            // maintaining work for group and array -forms
            if (fields[key].formGroupName || fields[key].formArrayName) {

                // setting their father's
                // if any group present - bypaas
                formSchema.fields[key] = fields[key];
                fields[key].father = formSchema;
                continue;
            }


            let field = new FieldSchema(key, formId, fields[key].value,
                fields[key].validations, fields[key].error,
                false, false, fields[key].valid, formSchema);

            forms[formId].fields[key] = field;
        }

        this.constructForm(formId);
    }


    // Exectute for FORM
    constructForm(formId) {

        let formData = forms[formId];
        let formFields = formData.fields;

        // work for formGroupName
        // work for formArrayName


        for (const key in formFields) {

            formData.value[key] = formFields[key].value;

            // run validators
            // set Errors Errors
            updateFieldValidations(formFields[key], {
                target: {
                    value: formFields[key].value
                }
            },formData);

            // set valid or not
            updateFieldValidity(formFields[key], formData);
        }

        updateFormValidity(formId);

        formData.valueChanges.next(formData);
    }
}
