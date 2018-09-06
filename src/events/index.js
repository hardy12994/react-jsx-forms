import { forms } from '../core-data/formData';
import executeEvents from './wraped-events';


let wrapEvents = (formId) => {

    let formFields = forms[formId].fields;

    for (const field in formFields) {

        if (formFields[field].fields) {

            // let collectionTypeIsArr = formFields[field].formArrayName;
            // let collectionType = collectionTypeIsArr ? 'array' : 'group';

            //execute for form-group / form-array
            wrapEventsForGroupsAndArray(formId, formFields[field].fields);
            continue;
        }

        var input = document.querySelector(`#${field}`); // by ID

        if (!input) {
            var sameNameInputs = document.querySelectorAll(`input[name=${field}]`);

            for (let index = 0; index < sameNameInputs.length; index++) {
                if (sameNameInputs[index].form['id'] === formId) {
                    executeEvents(formId, sameNameInputs[index], field);
                }
            }
            continue;
        }


        executeEvents(formId, input, field);
    }

};

export default wrapEvents;


export let wrapEventsForGroupsAndArray = (formId, fields) => {

    for (const field in fields) {

        if (fields[field].fields) {

            //execute for form-group / form-array
            wrapEventsForGroupsAndArray(formId, fields[field].fields);
            continue;
        }
        let fieldID = fields[field].id;
        let querry = `#${fieldID}`;
        let input = document.querySelector(querry); // by ID(default)
        // let dynamicGenratedIdType;
        let fatherFormGroupName = fields[field].father.formGroupName;
        let fatherFormArrayName = fields[field].father.formArrayName;
        let fatherFormArrayId = fields[field].father.formArrayId;
        let fieldFormArrayId = fields[field].formArrayId;

        // FOR FIELD IN GROUP
        if (fatherFormGroupName && fatherFormArrayId) {
            // array ->-> grp ->-> field
            input = null;
            // dynamicGenratedIdType = 'groupID';
            let grp = document.querySelector(`[form_array=${fatherFormArrayId}]`);
            input = grp ? grp.querySelector(querry) : null;
        }

        // FOR FIELD IN ARRAY        
        if (fatherFormArrayName && fieldFormArrayId) {
            // array ->-> field            
            input = null;
            // dynamicGenratedIdType = 'fieldID';
            let grp = document.querySelector(`[form_array=${fieldFormArrayId}]`);
            input = grp ? grp.querySelector(querry) : null;
        }


        if (!input) {
            let sameNameInputs = document.querySelectorAll(`input[name=${fieldID}]`);

            for (let index = 0; index < sameNameInputs.length; index++) {
                if (sameNameInputs[index].form['id'] === formId) {
                    executeEvents(formId, sameNameInputs[index], fieldID);
                }
            }
            continue;
        }

        let dynamicGenratedId = fatherFormArrayId || fieldFormArrayId;

        executeEvents(formId, input, fieldID, dynamicGenratedId);
    }

};