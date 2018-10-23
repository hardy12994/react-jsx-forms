import _ from 'underscore';
import { forms } from './core-data/formData';
import { compareObj } from './helpers/object.helper';
import { wrapEventsForGroupsAndArray } from './events';


let getAllFields = function (allFormFields, theObject) {

    for (const key in theObject) {
        allFormFields.push(theObject[key]);

        if (theObject[key].fields) {
            getAllFields(allFormFields, theObject[key].fields);
        }
    }
    return allFormFields;
};

export let getAllInputFields = function (allFormFields, theObject) {


    for (const key in theObject) {

        if (theObject[key].fields) {
            getAllFields(allFormFields, theObject[key].fields);
        } else {
            allFormFields.push(theObject[key]);
        }
    }
    return allFormFields;
};

let find = function (theObject, fieldId) {

    let result = null;
    let allFormFields = [];
    allFormFields = getAllFields(allFormFields, theObject);
    result = allFormFields.find(field => field.id === fieldId) || null;
    return result;
};

export let fieldFinder = (formId, fieldId) => {
    let form = forms[formId];
    let formFields = form.fields;
    return find(formFields, fieldId);
};

let findArrayGroup = function (theObject, arrayDynamicGroupId) {

    let result = null;
    let allFormFields = [];
    allFormFields = getAllFields(allFormFields, theObject);

    result = allFormFields.find(arrayGrp => {
        if (arrayGrp.formGroupName &&
            arrayGrp.formArrayId &&
            arrayGrp.formArrayId === arrayDynamicGroupId) {
            return arrayGrp;
        }
    }) || null;

    return result;
};


let findArrayField = function (formFields, arrayDynamicFieldId) {

    let result = null;
    let allFormFields = [];
    allFormFields = getAllFields(allFormFields, formFields);

    result = allFormFields.find(arrayGrp => {
        if (arrayGrp.formArrayId &&
            arrayGrp.formArrayId === arrayDynamicFieldId) {
            return arrayGrp;
        }
    }) || null;

    return result;
};

export let arrayFieldFinder = function (formId, arrayDynamicFieldId) {
    let form = forms[formId];
    let formFields = form.fields;
    return findArrayField(formFields, arrayDynamicFieldId);
};



export let arrayGroupFinder = (formId, arrayDynamicGroupId) => {
    let form = forms[formId];
    let formFields = form.fields;
    return findArrayGroup(formFields, arrayDynamicGroupId);
};



export let getAllFathers = (field, includeItSelf = true) => {

    let allFathers = [];
    let fieldFather = field.father;
    allFathers = includeItSelf ? [field] : [];

    while (fieldFather !== null) {

        allFathers.push(fieldFather);

        fieldFather = fieldFather.father;
    }

    return allFathers;
};

export let syncValueToFathers = (fieldData, updatedFieldValue) => {

    let fathers = getAllFathers(fieldData, false);
    let valueToBeUpdated = updatedFieldValue;
    let fieldId = fieldData.id;

    //only use for grps and normal fields
    _.each(fathers, father => {


        if (father.fields.length) { //means we are setting for array
            let fatherValue = [];
            father.fields.forEach(item => fatherValue.push(item.value));
            father.value = fatherValue;
            valueToBeUpdated = fatherValue;
            fieldId = father.id;
            return;
        }

        if (father.formGroupName && father.formArrayId) {

            //group inside array
            father.fields[fieldId].value = valueToBeUpdated;
            father.value[fieldId] = valueToBeUpdated;

            valueToBeUpdated = father.value;
            fieldId = father.id;
            return;
        }

        if (father.formGroupName || father.formId === father.id) {

            father.value[fieldId] = valueToBeUpdated;

            valueToBeUpdated = father.value;
            fieldId = father.id;
            return;
        }

        if (father.formArrayName) {
            /**
             * TODO
             */
        }

        father.value[fieldId] = valueToBeUpdated;
    });
};



export let syncValidityToFather = (father) => {

    if (!father) return;

    let fields = father.fields;

    for (const key in fields) {
        if (!fields[key].valid) {
            father.valid = false;
            return;
        }
    }
    father.valid = true;
};


export let syncValidityToFathers = (fieldData) => {


    let fields;
    let father = fieldData.father;
    let fathers = getAllFathers(fieldData, false);
    if (!father) return;

    fathers.forEach(itemAsFather => {

        let fields = itemAsFather.fields;
        let validity = true;

        for (const key in fields) {
            if (!fields[key].valid) {
                validity = false;
                break;
            }
        }
        itemAsFather.valid = validity;

        // if (validity) {//true
        //     syncValidityToFathers(itemAsFather);
        // }
    });
};


export let checkFieldsType = function (fields) {// for array type check

    let value = fields[0].value;

    for (let index = 0; index < fields.length; index++) {
        const element = fields[index];
        let bool = compareObj(element.value, value);
        if (!bool) { throw 'Array list elements should be of same kind'; }
    }
};

let getValueType = function (value) {

    if (typeof value === 'string') return 'field';
    if (value.constructor === Array) return 'fieldArray';
    if (typeof value === 'object') return 'fieldGroup';
};


/** 
 * Currently Used
 * IMPORTANT - Dump should shadow like value of fieldData.value
 * @param {dump} form Whole form Dump
 * @param {fieldData} in which this dump should be fixed
*/
export let patchMechanism = function (fieldData, dump) {

    let value = fieldData.value;

    for (const key in dump) {

        if (!value.hasOwnProperty(key)) continue;

        let type = getValueType(value[key]);

        if (type === 'field') {
            //no recursion
            fieldData.fields[key].value = dump[key];
            syncValueToFathers(fieldData.fields[key], dump[key]);
            fieldData.fields[key].updateValueAndValidity();
            continue;
        }


        //recursion will happen here
        //b'coz no direct fields are found
        if (type === 'fieldGroup') {

            patchMechanism(fieldData.fields[key], dump[key]);
            continue;
        }

        //recursion will happen here
        //b'coz no direct fields are found
        if (type === 'fieldArray') {
            // here field will be fieldGroup OR field
            // we can check that by `fieldsType`

            let arrayFields = fieldData.fields[key].fields;

            if (fieldData.fields[key].fieldsType === 'group') {
                for (let index = 0; index < arrayFields.length; index++) {
                    patchMechanism(arrayFields[index], dump[key][index]);
                    continue;
                }
            }

            if (fieldData.fields[key].fieldsType === 'array') {

                //to be check - not checked yet
                for (let index = 0; index < arrayFields.length; index++) {
                    patchMechanism(arrayFields[index], dump[key][index]);
                    continue;
                }
            }

            if (fieldData.fields[key].fieldsType === 'field') {
                // managing here only for field
                for (let index = 0; index < arrayFields.length; index++) {
                    arrayFields[index].value = dump[key][index];
                    syncValueToFathers(arrayFields[index], dump[key][index]);
                    arrayFields[index].updateValueAndValidity();
                }
                continue;
            }

        }
    }

};




// /**
//  * USED IN PAST
//  * @param {*} form Whole form Dump
//  * @param {*} dataDump all data array data + group data
//  */

// export let patchMechanism = function (formId, dataDump, formType = null, formTypeId = null) {

//     // dataDump is object
//     for (const item in dataDump) {
//         let valueToPopulated = dataDump[item];

//         // valueToPopulated is formArray
//         if (Array.isArray(valueToPopulated)) {

//             valueToPopulated.forEach(element => {
//                 let index = valueToPopulated.indexOf(element);
//                 let arrayGroupId = item + '_' + (index).toString();

//                 patchMechanism(formId, {
//                     [index]: element
//                 }, 'arrayGroup', arrayGroupId);
//             });
//             continue;
//         }


//         //valueToPopulated is formGrp
//         if (typeof valueToPopulated === 'object') {
//             if (formType === 'arrayGroup') {
//                 for (const key in valueToPopulated) {
//                     patchMechanism(formId, {
//                         [key]: valueToPopulated[key]
//                     }, 'arrayGroup', formTypeId); // item= arrayGroupId
//                 }
//                 continue;
//             } else {
//                 //simple group 
//                 for (const key in valueToPopulated) {
//                     patchMechanism(formId, {
//                         [key]: valueToPopulated[key]
//                     }, 'group', item); // item= groupId
//                 }
//                 continue;
//             }
//         }


//         // direct conrol
//         // indirectly come here
//         if (typeof valueToPopulated === 'boolean' ||
//             typeof valueToPopulated === 'number' ||
//             typeof valueToPopulated === 'string') {

//             let field;
//             if (formType === 'group') {
//                 field = fieldFinder(formId, formTypeId);
//                 if (!field) {
//                     throw new Error('oops! no field found or you haven\'t make schema before patch.');
//                 }

//             } else if (formType === 'arrayGroup') {

//                 // for formArrayId === formTypeId Field
//                 // formArrayId can be field inside group then in array 
//                 // OR
//                 // formArrayId can be field directly inside array 

//                 let searchedField = arrayFieldFinder(formId, formTypeId); // to be fixed in complex array in array forms
//                 if (!searchedField) {
//                     throw new Error('oops! no field found or you haven\'t make schema before patch.');
//                 }
//                 if (searchedField.fields) {
//                     //grp or array
//                     field = searchedField.fields[item];
//                 } else {
//                     //field                    
//                     field = searchedField;
//                 }

//                 if (!field) {
//                     throw new Error(`oops! no field found as '${item}' during patch`);
//                 }
//                 //update field <- group <- array || field <- array
//                 field.value = valueToPopulated;

//             } else {
//                 field = fieldFinder(formId, item);
//                 field.value = valueToPopulated;
//             }

//             if (!field) {
//                 throw new Error('OOPS! no field found or you haven\'t make schema before patch.');
//             }
//             syncValueToFathers(field, valueToPopulated);
//             field.updateValueAndValidity({});
//         }
//     }
// };


export let getProperties = (properties) => {
    if (!properties && _.isEmpty(properties)) {
        properties = {
            onlySelf: false,//not working
            emitEvent: false
        };
    }
    return properties;
};


export let updateformArrayIds = (fields = []) => {
    for (let i = 0; i < fields.length; i++) {
        let name = fields[i].father.formArrayName;
        fields[i].setFormArrayId(name, i);
    }
};