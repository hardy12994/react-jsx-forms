import _ from 'underscore';
import {
    getAllFathers,
    syncValueToFathers,
    syncValidityToFathers,
    // syncErrorsToFathers,
    syncValidityToFather
} from '../utility';


/**
 * @description this will update your field error according to the validations 
 * present
 */

// Execute Validations - GRP
export let updateFieldValidations = (fieldData, event, father) => {

    // if (!fieldData.validations || fieldData.validations.length === 0) {
    //     fieldData.error = null;
    //     return;
    // }

    if (!fieldData.error) {
        fieldData.error = {};
    }

    if (!fieldData.validations || fieldData.validations.length === 0) {

        // if (!_.isEmpty(fieldData.error)) {

        //     if (father) {
        //         if (!father.error[fieldData.id]) {
        //             father.error[fieldData.id] = {};
        //         }
        //         father.error[fieldData.id] = fieldData.error;
        //     }
        // }
        return;

    } else {
        _.each(fieldData.validations, validator => {
            let bool;

            if (!validator.isStatic) {
                //dynamic
                bool = validator.action(event);
            } else {
                //static
                bool = validator.action(validator[validator.name], event);
            }


            // setting Error in fieldData
            fieldData.error[validator.name] = bool;

            // if (father) {
            //     // setting Error in fieldFather            
            //     if (!father.error[fieldData.id]) {
            //         father.error[fieldData.id] = {};
            //     }
            //     father.error[fieldData.id][validator.name] = bool;
            // }

        });
    }
};



/**
 * @description this will update your field validity and 
 * also update your father validity only 
 * if field is having error
 */

// Field VALID / INVALID
export let updateFieldValidity = (fieldData, father) => {


    // if (!fieldData.formArrayId && (fieldData.formGroupName || fieldData.formArrayName)) {

    //     // **** NOT work when group as field in Array Group. ****

    //     // the group and array forms has already been check for validity
    //     // here we just need to make sync with father

    //     // syncValidityToFathers(fieldData.father);
    //     syncValidityToFathers(fieldData);
    //     return;
    // }

    // if (_.isEmpty(fieldData.error)) {
    //     fieldData.valid = true;
    //     return;
    // }

    fieldData.valid = true;

    for (const key in fieldData.error) {
        if (fieldData.error[key]) { //eg : required = true
            fieldData.valid = false;
            break;
        }
    }

    //after field validity decided then also check fields under valid or not 
    // if all fields are valid then field validity is valid otherwise false

    if (fieldData.fields) {
        for (const key in fieldData.fields) {
            if (!fieldData.fields[key].valid) {
                fieldData.valid = false;
                break;
            }
        }
    }


    syncValidityToFathers(fieldData);
    return;
};


/**
 * @description this will update property - 
 * DIRTY and TOUCHED in field as well as father of that field.
 */

export let updateDirtyANDTouchedUptoTop = (fieldData) => {

    let fathers = getAllFathers(fieldData);

    fathers.forEach(item => {
        item.dirty = true;
        item.touched = true;
    });
};


/**
 * @description this will update property - 
 * DIRTY in field as well as fathe+r of that field.
 */

export let updateDirtyUptoTop = (fieldData) => {

    let fathers = getAllFathers(fieldData);

    fathers.forEach(item => {
        item.dirty = true;
    });

};


/**
 * @description this will update property - 
 * TOUCHED in field as well as father of that field.
 */

export let updateTouchedUptoTop = (fieldData) => {

    let fathers = getAllFathers(fieldData);

    fathers.forEach(item => {
        item.touched = true;
    });

};


/**
 * @description this will update value up to top
 */

export let updateFieldValueUptoTop = (fieldData, value) => {
    syncValueToFathers(fieldData, value);
};








// // Execute Validations - ARR
// export let updateFieldValidations_ARR = (index, fieldData, event, father) => {

//     // if (!fieldData.validations || fieldData.validations.length === 0) {
//     //     fieldData.error = null;
//     //     return;
//     // }

//     if (!fieldData.error) {
//         fieldData.error = [];
//     }

//     if (!fieldData.validations || fieldData.validations.length === 0) {

//         if (fieldData.error) {

//             // if (!father.error[fieldData.id]) {
//             //     father.error[fieldData.id] = {};
//             // }
//             father.error[index] = fieldData.error;
//         }

//     } else {
//         _.each(fieldData.validations, validator => {
//             let bool;

//             if (!validator.isStatic) {
//                 //dynamic
//                 bool = validator.action(event);
//             } else {
//                 //static
//                 bool = validator.action(validator[validator.name], event);
//             }


//             // setting Error in fieldData
//             fieldData.error[validator.name] = bool;

//             // setting Error in fieldFather            
//             if (!father.error[fieldData.id]) {
//                 father.error[fieldData.id] = {};
//             }
//             father.error[fieldData.id][validator.name] = bool;

//         });
//     }
// };