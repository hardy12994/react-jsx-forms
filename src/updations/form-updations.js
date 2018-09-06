
import { forms } from '../core-data/formData';



// Form VALID / INVALID
export let updateFormValidity = (formId) => {

    let formFields = forms[formId].fields;

    for (const key in formFields) {

        if (!formFields[key].valid) {
            forms[formId].valid = false;
            return;
        }

    }
    forms[formId].valid = true;
};