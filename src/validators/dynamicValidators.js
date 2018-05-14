export class DyanamicValidators {

    static compose({ name, action }) {

        return {
            name: name,
            isStatic: false,
            action: action
        };

    }
}