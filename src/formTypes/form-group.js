import { FormGroupSchema, FieldSchema } from '../schemas';

import {
    updateFieldValidations,
    updateFieldValidity
} from '../updations/field-updations';



export class FormGroup {

    constructor(formId, formGroupId, fields) {
        return this.constructFormGroupFields(formId, formGroupId, fields);
    }


    constructFormGroupFields(formId, formGroupId, fields) {

        let formGroup = new FormGroupSchema(formGroupId, formId);

        for (const key in fields) {

            if (fields[key].formGroupName || fields[key].formArrayName) {

                // if any group present - bypaas
                fields[key].father = formGroup;
                formGroup.fields[key] = fields[key];
                continue;
            }

            let field = new FieldSchema(key, formId, fields[key].value,
                fields[key].validations, fields[key].error, false,
                false, fields[key].valid, formGroup);

            formGroup.fields[key] = field;
        }

        return this.constructFormGroup(formGroup);
    }


    constructFormGroup(formGroup) {

        let fields = formGroup.fields;
        for (const key in fields) {

            //setting Value in group form
            formGroup.value[key] = fields[key].value;

            // run validators
            // set Errors Errors
            updateFieldValidations(fields[key], {
                target: {
                    value: fields[key].value
                }
            },formGroup);

            // set valid or not
            updateFieldValidity(fields[key], formGroup);
        }
        //trigger for group form
        formGroup.valueChanges.next(formGroup);
        return formGroup;
    }

}