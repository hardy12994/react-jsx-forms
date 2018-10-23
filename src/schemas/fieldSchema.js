import { ControlRoom } from './controlRoomSchema';


export class FieldSchema extends ControlRoom {

    constructor(
        id, formId, value = '',
        validations = [], error = {},
        touched = false, dirty = false,
        valid = true, father = null) {

        let valueToString = (typeof value !== 'object' ? value.toString() : value);

        super(id, formId,
            valueToString,
            validations, error, touched,
            dirty, valid, father);

        this.formArrayId = null;
    }

    setFormArrayId(name, index) {
        this.formArrayId = name + '_' + index.toString();
    }
}