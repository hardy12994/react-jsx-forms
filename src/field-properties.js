import { Subject } from 'rxjs';

export class FieldProperties {

    constructor(id, value = '', validations = [], error = null,
        touched = false, dirty = false, valid = true) {
        this.id = id;
        this.value = value;
        this.validations = validations;
        this.error = error; // depend on validations
        this.valid = valid; // depend on validations
        this.touched = touched;
        this.dirty = dirty;
        this.valueChanges = new Subject();

        this.setErrorsForNoInputValidations();

    }


    setErrorsForNoInputValidations() {
        
        this.validations.forEach(validation => {

            if (validation.name === 'required') {
                this.error = {
                    required: true
                };
            }

        });
    }
}