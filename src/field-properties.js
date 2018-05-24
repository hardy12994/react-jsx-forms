import { Subject } from 'rxjs';
import _ from 'underscore';
import { forms } from './forms';
import { FormBuilder } from './form-builder';

export class FieldProperties {

    constructor(id, formId, value = '', validations = [], error = {},
        touched = false, dirty = false, valid = true) {
        this.id = id;
        this.formId = formId;
        this.value = value;
        this.validations = validations;
        this.error = error; // depend on validations
        this.valid = valid; // depend on validations
        this.touched = touched;
        this.dirty = dirty;
        this.valueChanges = new Subject();

        this.eventsTrigger = {
            focusEvent: false,
            keyDownEvent: false,
            // keyUpEvent: false,
            clickEvent: false
        };

        // this.setErrorsForNoInputValidations();
    }

    /** 
     * @argument errors = { key : value }, value will be boolean 
     * and updates validity on errors of form and field as well.
    */

    setErrors(errors) {
        if (!errors || _.isEmpty(errors)) {
            this.error = {};
            return;

        }
        if (typeof errors !== 'object') {
            throw new Error('setErrors accepts object.');
        }

        this.error = errors;

        for (const key in errors) {
            if (errors[key]) {
                forms[this.formId].valid = false;
                this.valid = false;
                return;
            }
        }

        this.valid = true;
        return;
    }


    /** 
     * @argument value = "value", value will be any String,
     * emitEvent = false, Boolean, Default is false,
     * To Emit (field valueChanges) set emitEvent to true.  
    */


    setValue(value, emitValue = false) {

        this.value = value;
        if (emitValue === true) {
            this.valueChanges.next(value);
        }
    }

    /** 
     * @returns the latest updated value.
    */

    getValue() {
        return this.value;
    }


    /** 
     * @argument validators= [Validators.required(), Validators.matchLength(10)] || null
     * validators can be updated. 
    */

    setValidators(validators) {

        if (!validators) { // on null
            this.validations = [];
            return;
        }

        if (!validators[0]) {
            throw new Error('setValidators accepts array.');
        }
        this.validations = validators;
    }


    /** 
     * @argument errorCode="required" || null, returns Boolean , 
     * check if this `required` key is present and is true in Erorrs 
     * or if errorCode is null then it will tell true error validations are 
     * present in field or not
    */

    hasError(errorCode = null) {

        if (errorCode && this.error[errorCode] === true) {
            return true;
        } else {
            return this.valid;
        }
    }

    /** 
     * @argument isDirty = true, makes the field dirty mannual, Default true,
     * it can also make undirty by passing false in it.
    */

    makeDirty(isDirty = true) {
        this.dirty = isDirty;
        this.eventsTrigger.keyDownEvent = isDirty;
        return;
    }


    /** 
     * @argument isTouched = true, makes the field Touched mannual, Default true,
     * it can also make unTouched by passing false in it.
    */

    makeTouched(isTouched = true) {
        this.touched = isTouched;
        this.eventsTrigger.focusEvent = isTouched;
        return;
    }

    /** 
     * @returns it returns latest field updated in properties 
    */

    getForm() {
        return {
            id: this.id,
            formId: this.formId,
            value: this.value,
            validations: this.validations,
            error: this.error, // depend on validations
            valid: this.valid, // depend on validations
            touched: this.touched,
            dirty: this.dirty,
            valueChanges: this.valueChanges
        };
    }


    /***************** 
    ***** FORM *******
    *******************/

    /** 
    * @argument properties= { onlySelf : boolean , emitEvent : boolean }
    * 
    * @description
    * Default - onlySelf = false ,emitEvent = false
    * 1. Update value in one step up in form (value),
    * 2. Validate when value is update.
    * 3. Update Field Validity.
    * 4. Update Value According to **onlySelf**.
    * 5. Emit values to ValueChanges to the form according to **emitEvent**
    * 
    */

    updateValueAndValidity(properties) {

        let formData = forms[this.formId];

        let formFields = formData.fields;

        FormBuilder.updateFieldValidations(formFields[this.id], {
            target: {
                value: this.value
            }
        });

        FormBuilder.updateFieldValidity(formFields[this.id]);

        FormBuilder.updateFormValidity(this.formId);

        if (_.isEmpty(properties)) return;

        if (!properties.onlySelf) {
            forms[this.formId].value[this.id] = this.value;
        }

        if (properties.emitEvent) {

            this.valueChanges.next(this.value);

            forms[this.formId].valueChanges.next(forms);

        }
    }

    // setErrorsForNoInputValidations() {

    //     this.validations.forEach(validation => {

    //         if (validation.name === 'required') {
    //             this.error = {
    //                 required: true
    //             };
    //         }
    //         return;
    //     });
    // }

}