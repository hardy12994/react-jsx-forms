import { FormArraySchema, FieldSchema } from '../schemas';

import {
    updateFieldValidity,
    updateFieldValidations
} from '../updations/field-updations';
import { checkFieldsType } from '../utility';


export class FormArray {

    constructor(formId, formArrayId, fields = []) {
        // personalForm, nominies , allNominies
        checkFieldsType(fields);
        return this.constructFormArrayFields(formId, formArrayId, fields);
    }

    constructFormArrayFields(formId, formArrayId, fields) {


        let formArrGroup = new FormArraySchema(formArrayId, formId);

        // fields = ARRAY
        for (let i = 0; i < fields.length; i++) {
            fields[i].setFormArrayId(formArrayId, i); //in grp
            fields[i].father = formArrGroup;
            formArrGroup.fields.push(fields[i]);
        }

        return this.constructFormArray(formArrGroup);
    }


    constructFormArray(formArrGroup) {

        this.setFieldsType(formArrGroup);

        let fields = formArrGroup.fields;

        for (let key = 0; key < fields.length; key++) {
            //setting Value in group form
            formArrGroup.value[key] = fields[key].value;

            // run validators
            // set Errors Errors
            updateFieldValidations(fields[key], {
                target: {
                    value: fields[key].value
                }
            }, formArrGroup);

            // set valid or not
            updateFieldValidity(fields[key], formArrGroup);
        }
        //trigger for group form
        formArrGroup.valueChanges.next(formArrGroup);
        return formArrGroup;
    }


    setFieldsType(formArrGroup) {

        if (formArrGroup.fields[0] && formArrGroup.fields[0].formGroupName) {
            formArrGroup.fieldsType = 'group';
            return;
        }

        if (formArrGroup.fields[0] && formArrGroup.fields[0].formArrayName) {
            formArrGroup.fieldsType = 'array';
            return;
        }

        formArrGroup.fieldsType = 'field';
        return;
    }

}