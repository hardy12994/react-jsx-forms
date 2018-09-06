import { ControlRoom } from './controlRoomSchema';
import _ from 'underscore';
import {
    checkFieldsType, patchMechanism, getAllInputFields,
    getProperties, updateformArrayIds
} from '../utility';
import { wrapEventsForGroupsAndArray } from '../events';


export class FormArraySchema extends ControlRoom {

    constructor(
        id, formId, value = [],
        validations = [], error = {},
        touched = false, dirty = false,
        valid = true, father = null) {

        super(id, formId, value,
            validations, error, touched,
            dirty, valid, father);

        this.formArrayName = id;
        this.fieldsType = null; // which type of fields are present in fields array
        this.fields = [];
    }

    /** 
     * @argument value = {}, value will be any Object,
     * set the value if it is present in the parameter object
     * emitEvent = false, Boolean, Default is false,
     * To Emit (field valueChanges) set emitEvent to true.  
    */

    patchValue(value, properties) {

        if (!properties && _.isEmpty(properties)) {
            properties = {
                onlySelf: false,//not working
                emitEvent: false
            };
        }
        
        patchMechanism(this, value);
        if (properties.emitEvent) {
            this.valueChanges.next(value);
        }
    }


    /*
     * for dynamic controls on form field.
     * Call updateValueAndValidity() in emit - true so that View updated.
     * Call activateBonding() in callback of setState after View updated.
     */

    // work at last index default
    // field should be constructed
    push(field, properties) {

        if (this.fields[0]) checkFieldsType([this.fields[0], field]);
        properties = getProperties(properties);

        let nextIndex = this.fields.length;
        field.formArrayId = this.id + '_' + nextIndex;
        field.father = this;

        this.fields.push(field);
        this.value.push(field.value);
        this.updateValueAndValidity(properties);
    }

    /*
 * for dynamic controls on form field.
 * Call updateValueAndValidity() in emit - true so that View updated.
 * Call activateBonding() in callback of setState after View updated.
 */

    // work at specified index default    
    pushAt(field, index, properties) {

        if (this.fields[0]) checkFieldsType([this.fields[0], field]);
        properties = getProperties(properties);

        field.formArrayId = this.id + '_' + index;
        field.father = this;

        this.fields.splice(index, 0, field);
        this.value.splice(index, 0, field.value);

        //change other formArrayId indexes
        updateformArrayIds(this.fields);
        this.updateValueAndValidity(properties);
    }


    /*
 * for dynamic controls on form field.
 * Call updateValueAndValidity() in emit - true so that View updated.
 * Call activateBonding() in callback of setState after View updated.
 */

    // remove at last index default
    remove(properties) {
        properties = getProperties(properties);

        this.fields.pop();
        this.value.pop();
        this.updateValueAndValidity(properties);
    }


    /*
* for dynamic controls on form field.
* Call updateValueAndValidity() in emit - true so that View updated.
* Call activateBonding() in callback of setState after View updated.
*/

    // remove at specified index default
    removeAt(index, properties) {

        properties = getProperties(properties);

        this.fields.splice(index, 1);
        this.value.splice(index, 1);
        //change other formArrayId indexes
        updateformArrayIds(this.fields);
        this.updateValueAndValidity(properties);
    }




    // used on dynamic view then we have to bind that field
    activateBonding() {
        // let fieldData = this.fields[index];
        // used for group which is part of form array

        let inpFields = getAllInputFields([], this.fields);
        inpFields.forEach(element => {
            for (const key in element.events) {
                if (element.events.hasOwnProperty(key)) {
                    element.events[key].unsubscribe(); // unsubscribe observable
                    delete element.events[key];
                }
            }
        });

        wrapEventsForGroupsAndArray(this.formId, [this]);
    }
}
