import { ControlRoom } from './controlRoomSchema';
import { patchMechanism } from '../utility';
import _ from 'underscore';


export class FormSchema extends ControlRoom {

    constructor(
        id, formId = id, value = {},
        validations = [], error = {},
        touched = false, dirty = false,
        valid = true, father = null) {

        super(id, formId, value,
            validations, error, touched,
            dirty, valid, father);

        this.fields = {};
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
}
