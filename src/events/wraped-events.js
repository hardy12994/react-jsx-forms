import { fromEvent } from 'rxjs';
import { updateField } from '../updations/event-updations';
import { updateDirtyUptoTop, updateTouchedUptoTop } from '../updations/field-updations';
import { fieldFinder, arrayGroupFinder, arrayFieldFinder } from '../utility';




let deactivateEvent = (observable) => {
    observable.unsubscribe();
};

let getInpField = (formId, fieldId, formArrayId) => {
    let fieldInForm;

    if (!formArrayId) {
        //for NORMAL Field
        fieldInForm = fieldFinder(formId, fieldId);
        if (!fieldInForm) throw `can not find any field for Id ${fieldId}`;

    } else {
        // for formArrayId Field
        // formArrayId can be field inside group then in array 
        // OR
        // formArrayId can be field directly inside array 

        let field = arrayFieldFinder(formId, formArrayId);
        if (!field) throw `can not find any field for Id ${formArrayId}`;
        if (field.fields) {
            //grp or array
            fieldInForm = field.fields[fieldId];
        } else {
            //field
            fieldInForm = field;
        }
    }
    return fieldInForm;
};


/**
 * @description Not any field value will be updated by events,
 * that will only updated by setValue of perticular field.
 * ON-BLUR Event will check wheather field is valid or not.
 */

let executeEvents = (formId, input, fieldId, formArrayId, formArrayIdType) => {

    let fieldInForm = getInpField(formId, fieldId, formArrayId, formArrayIdType);

    let focusEvent = fromEvent(input, 'blur')
        .subscribe(event => {

            // console.log('BLUR');

            let fieldInForm = getInpField(formId, fieldId, formArrayId);

            if (fieldInForm.touched) {
                return deactivateEvent(focusEvent);
            }
            if (!fieldInForm.events.focusEvent) {
                fieldInForm.events.focusEvent = focusEvent;
            }

            updateTouchedUptoTop(fieldInForm);
            updateField(formId, fieldInForm, event);
            // unsubscribe it
            deactivateEvent(focusEvent);
        });

    let keyDownEvent = fromEvent(input, 'keydown')
        .subscribe(event => {

            // console.log('KEYDOWN');

            let fieldInForm = getInpField(formId, fieldId, formArrayId);

            if (fieldInForm.dirty) {
                return deactivateEvent(keyDownEvent);
            }
            if (!fieldInForm.events.keyDownEvent) {
                fieldInForm.events.keyDownEvent = keyDownEvent;
            }

            updateDirtyUptoTop(fieldInForm);
            // unsubscribe it
            deactivateEvent(keyDownEvent);
        });


    /**
     * @description Run in case where user can't type by keyboard
     */

    let clickEvent = fromEvent(input, 'click')
        .subscribe(event => {

            // console.log('click');

            if (event.target.type === 'text' ||
                event.target.type === 'password') {

                return deactivateEvent(clickEvent);
            }
            if (!fieldInForm.events.clickEvent) {
                fieldInForm.events.clickEvent = clickEvent;
            }

            let fieldInForm = getInpField(formId, fieldId, formArrayId);

            updateDirtyUptoTop(fieldInForm);
            // unsubscribe it
            deactivateEvent(clickEvent);
        });


    /** 
     * @description THIS WORK WILL BE DONE BY ONCHANGE EVENT PRESENT ON FIELD
    */

    // let keyEvent = fromEvent(input, 'keyup')
    //     .subscribe(event => {
    //         console.log('KEYUP');

    //         let inputId = field;

    //         // forms[that.props.id].fields[inputId].dirty = true;
    //         forms[that.props.id].fields[inputId].value = event.target.value;
    //         forms[that.props.id].value[inputId] = event.target.value;

    //         that.updateField(inputId, event);
    //         forms[formId].fields[inputId].eventsTrigger.keyUpEvent = true;

    //     });


    if (fieldInForm && !fieldInForm.events.keyDownEvent) {
        fieldInForm.events.keyDownEvent = keyDownEvent;
    }
    if (fieldInForm && !fieldInForm.events.focusEvent) {
        fieldInForm.events.focusEvent = focusEvent;
    }
    if (fieldInForm && !fieldInForm.events.clickEvent) {
        fieldInForm.events.clickEvent = clickEvent;
    }

};


export default executeEvents;