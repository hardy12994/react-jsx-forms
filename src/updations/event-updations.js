
import { forms } from '../core-data/formData';
import { updateFieldValidations, updateFieldValidity } from './field-updations';
import { updateFormValidity } from './form-updations';


/**
 * only work on ON-BLUR Event
 */

export let updateField = (formId, fieldInForm, event, triggerSubjects = true) => {

    let formData = forms[formId];

    // run validators
    // set Errors Errors
    updateFieldValidations(fieldInForm, event, fieldInForm.father);

    // set valid or not to TOP
    // syncValidityToFathers is called
    updateFieldValidity(fieldInForm, fieldInForm.father);

    if (triggerSubjects) {
        formData.valueChanges.next(forms);
        fieldInForm.valueChanges.next(fieldInForm);
    }
};