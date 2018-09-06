let checkRef = (event) => {
    if (!event) {
        throw new Error('no event found');
    }
};

export class StaticValidators {

    static minChar(data) {
        return {
            name: 'minChar',
            isStatic: true,
            minChar: data,
            action: StaticValidators.minCharValidator
        };
    }

    static maxChar(data) {
        return {
            name: 'maxChar',
            isStatic: true,
            maxChar: data,
            action: StaticValidators.maxCharValidator
        };
    }

    static matchLength(data) {
        return {
            name: 'matchLength',
            isStatic: true,
            matchLength: data,
            action: StaticValidators.matchLengthValidator
        };
    }

    static matchStringText(data) {
        return {
            name: 'matchStringText',
            isStatic: true,
            matchLength: data,
            action: StaticValidators.matchStringTextValidator
        };
    }

    static matchNumText(data) {
        return {
            name: 'matchNumText',
            isStatic: true,
            matchLength: data,
            action: StaticValidators.matchNumTextValidator
        };
    }

    static pattern(data) {
        return {
            name: 'pattern',
            isStatic: true,
            pattern: data,
            action: StaticValidators.patternValidator
        };
    }


    static required(data) {
        return {
            name: 'required',
            isStatic: true,
            required: null,
            action: StaticValidators.requiredValidator
        };
    }


    /** 
     * returns true when your input value string not matched provided value
    */
    static matchStringTextValidator(data, event) {

        checkRef(event);
        if (!event.target) return;
        let str = data.toString();
        let value = event.target.value;
        if (value && value !== str) {
            return true;
        }
        return false;
    }

    /** 
     * not define in doc YET
    */
    static matchNumTextValidator(data, event) {

        checkRef(event);
        if (!event.target) return;
        let num = Number(data);
        let value = event.target.value;
        if (value && value !== num) {
            return true;
        }
        return false;
    }

    /**
     * 
     * returns true when your input value length not 
     * matched provided value lenght.
     */
    static matchLengthValidator(data, event) {

        checkRef(event);
        if (!event.target) return;
        let charLength = data;
        let value = event.target.value;
        if (value && value.length !== Number(charLength)) {
            return true;
        }
        return false;
    }


    /** 
     * returns true when your inp value length is more than provided value lenght
     * Eg - provided length = 3,
     * value = ronak, false 
     * value = ron, true 
     * value = ro, true 
    */
    static maxCharValidator(data, event) {

        checkRef(event);
        if (!event.target) return;
        let charLength = data;
        let value = event.target.value;
        if (value && value.length >= Number(charLength)) {
            return true;
        }
        return false;

    }



    /** 
     * returns true when your inp value length is less than provided value lenght
     * Eg - provided length = 3,
     * value = ronak, false 
     * value = ron, true 
     * value = ro, true 
    */
    static minCharValidator(data, event) {

        checkRef(event);
        if (!event.target) return;

        let charLength = data;
        let value = event.target.value;
        if (value && value.length <= Number(charLength)) {
            return true;
        }
        return false;
    }


    static requiredValidator(data, event) {

        checkRef(event);
        if (!event.target) return;

        if (!event.target.value) {
            return true;
        }
        return false;
    }

    static patternValidator(data, event) {

        checkRef(event);
        if (!event.target) return;

        let patternShouldBe = data;
        return patternShouldBe.test(event.target.value) ? false : true;
    }

}