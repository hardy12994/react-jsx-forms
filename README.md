This Module helps you to deal with the Forms in **ReactJS**. It gives you very flexible form which will update you state of your Form every time you interact with it and this will save three main actions **( Touched, Dirty, Valid )** of every field form that you can get help in Validation area.

**This module will look familiar to those who had done *Angular* (A) Forms.**

## What it Provides ?

-  Make the Form Fields enrich and handles in very Smooth way.
-  Verify all Validations for perticular Field in Form.
-  Handel and maintain all the errors.
-  Add Properties like `touched`, `dirty`, `error`, `valid`, `valueChanges` to each field in     form.
-  And Yeah !! It makes sure your form is VALID or NOT.
-  The Cool Thing is, this module uses **`rxjs`** which helps to decide when to do what.


## Installation - 

```sh
       npm install --save react-jsx-forms
```

## How to use ?

First you will initialize you form with `FormBuilder`. `FormBuilder` will accept the Form Schema. This will provide your form with extra powers. These Powers will be provided to your Form and Form Fields. Let's Jump to Code Directly -

```sh
import { Forms, FormBuilder, Validators } from 'react-jsx-forms';
import React, { Component } from 'react';

export class LoginComponent extends Component {

       constructor(props) {

        super(props);
        this.formInit();
        this.state = {
            loginForm: { ...this.loginForm }
        };

        // Discribe Below        
        this.handelChangeEvent = this.handelChangeEvent.bind(this);
       }

       formInit() {

        // this is your form Schema
        var fields = {
            
            // input type text with id phone
            phone: {
                value: '',
                validations: [Validators.required(), Validators.matchLength(10)]
            },

            // input type password with id password            
            password: {
                value: '',
                validations: [Validators.required(), Validators.compose(notI)]
            },

            // input type checkbox with id save_password      
            save_password: {
                value: true
            },

            // input type radio with id gender                        
            gender: {
                value: 'female',
                validations: [Validators.required()]
            }
        };

        // `loginForm`, first parameter or your FormBuilder is your FormId.
        // `FormBuilder`, helps you to build your form.

        this.loginForm = new FormBuilder('loginForm', fields);
    }

        componentDidMount() {
        // Discribe Below     
        this.activateSubscribers();
    } 

       render(){

           // you can see here your form is more than your defined.
           // See the GIF bellow
           console.log(this.state.loginForm);

           return (
               <MyForm 
                    formFields = {this.state.loginForm.fields} 
                    onChange = { this.handelChangeEvent }
                    />
           );
       }
}
```

### Form with Powers -

![FormWithPowers](http://res.cloudinary.com/dkws91cqo/image/upload/v1527152960/Webp.net-gifmaker_2_jslufj.gif) 



## Validations

You can See Above Validations ( All resturns Boolean ) are Also Set in the Form Schema.

Some of the validations are InBuilt like -

- **Validators.required()**
  
       Returns true when field is Empty.

- **Validators.minChar(10)**

       Returns true when field value length is less that limit 10.

- **Validators.maxChar(10)**
       
       Returns true when field exceeds the limit 10.

- **Validators.pattern(/hello/g)**  

       Returns true when Pattern is Not Matched.

- **Validators.matchLength(10)**  
       
       Returns true when field length is not Matched.

- **Validators.matchStringText(Hello)**  
       
       Returns true when field value(string) is not equal to "Hello".

- **Validators.matchNumText(10000)**  
       
       Returns true when field value(string) is not equal to `10000`.

You can also Compose your OWN VALIDATION with **`Validators.compose()`**.

Compose function will accepts an `Object` and return `Boolean`.

Let's Define `notI` object which is used above -

```sh

let notI = {
    name: 'notI',
    action: function (event) { 
        
        // event you get from which you have define this Validation as in password

        let value = event.target.value;
        if (value.includes('i')) {
            return true;
        }
        return false;
    }
};

// You can set as - (in Validators Array)

**`Validators.compose(notI)`**

```


## What form Gives ?

#### What this form provide us, Let See -

```sh

 fields : {
     phone : {
         dirty : false ,
         touched : false ,
         error : { 
             // Depends on Validations
         },
         formId : "loginForm",
         id : "phone",
         touched : false ,
         value : "",
         valid : true , //false if any validation fail
         validations : [], // which you set in state
         valueChanges : Subject() // // rxjs Subject - subscribe it to get the form when PHONE value changes 
     }
 }
 id : "loginForm",
 value : { 
     phone : ""
 }
 valid : false ,
 valueChanges : Subject() // rxjs Subject - subscribe it to get the form when any value changes

```

#### Check the Fuctions presenet in every Field have own motive -



- **setErrors(errors)**
       
       Expects errors = { key : value }, value will be boolean and updates validity on errors of form and field as well.

- **setValue(value, emitValue = false)**
       
       value = "value", value will be any String, emitEvent = false, Boolean, Default is false, To Emit (field valueChanges) set emitEvent to true.

- **getValue()**

       Returns the latest updated value.

- **setValidators(validators)**

       Argument (validators= [Validators.required(), Validators.matchLength(10)] || null) validators can be updated.

- **hasError(errorCode = null)**

       Argument errorCode="required" || null, returns Boolean ,check if this `required` key is present and is true in Erorrs or if errorCode is null then it will tell true error validations are present in field or Not.

- **makeDirty(isDirty = true)**

       Argument isDirty = true, makes the field dirty mannual, Default true, it can also make undirty by passing false in it.

- **makeTouched(isTouched = true)**

        Argument isTouched = true, makes the field Touched mannual, Default true, it can also make unTouched by passing false in it.

- **getFieldData()**

       Returns it returns latest field updated in properties

- **updateValueAndValidity(properties)**

       Argument properties= { onlySelf : boolean , emitEvent : boolean }, Default - onlySelf = false ,emitEvent = false
    
           What this will do ?

           1. Update value in one step up in form (value),
           2. Validate when value is update.
           3. Update Field Validity.
           4. Update Value According to **onlySelf**.
           5. Emit values to ValueChanges(of Form and Field) to the form according to **emitEvent**




## How to USE ?


Now lets open the Expand the `Forms` tag and define our `JSX Form` with `Validations` in it -

```sh

let MyForm = props => {

    return (
        <Forms id="loginForm">

            <h3> TEXT INPUTS </h3>

            <input  placeholder="Mobile Number"
                onChange={props.handelChangeEvent}
                type="text" name="phone" id="phone"
                value={props.formFields.phone.value}
            />
            {props.formFields.phone.error &&
                (props.formFields.phone.touched && props.formFields.phone.error.required)
                ? <span className="error">Phone Number is Required</span>
                : <span></span>
            }
            {props.formFields.phone.error &&
                (props.formFields.phone.touched && props.formFields.phone.error.matchLength)
                ? <span className="error">Invalid Mobile Number.</span>
                : <span></span>
            }
            <input  placeholder="Password"
                onChange={props.handelChangeEvent}
                type="password" name="password" id="password"
                value={props.formFields.password.value}
            />
            {props.formFields.password.error &&
                (props.formFields.password.touched && props.formFields.password.error.required)
                ? <span className="error">Password is Required</span>
                : <span></span>
            }
            {props.formFields.password.error &&
                (props.formFields.password.touched && props.formFields.password.error.notI)
                ? <span className="error">Please Remove i/I from Password</span>
                : <span></span>
            }

            <h3> CHECKBOX INPUTS </h3>

            <div>
                <label className="sp" >Save Password : </label>
                <input type="checkbox" name="save_password" id="save_password"
                    checked={props.formFields.save_password.value}
                    onChange={props.handelChangeEvent}
                />
            </div>

            <h3> RADIO INPUTS </h3>

            <div>
                <label className="sp" >Gender : </label>
                <input type="radio" name="gender" value="male" id="male"
                    onChange={props.handelChangeEvent}
                    checked={props.formFields.gender.value === 'male'} />
                <span>Male</span><br />
                <input type="radio" name="gender" value="female" id="female"
                    onChange={props.handelChangeEvent}
                    checked={props.formFields.gender.value === 'female'} />
                <span>Female</span><br />
                <input type="radio" name="gender" value="other" id="other"
                    onChange={props.handelChangeEvent}
                    checked={props.formFields.gender.value === 'other'} />
                <span>Other</span>
            </div>
    </Forms>
    );
}
```

### How I Play with **onChange** -

As you know onChange field is required to make Updation in State so 

that we can see the updation in View. So Let's define it quickly -


```sh



    // call this.activateSubscribers() in `constructor` OR `componentDidMount`

    activateSubscribers() {

        this.loginForm
            .valueChanges
            .subscribe(form => {

                this.setState({
                    ...this.state,
                    loginForm: form.loginForm
                });

            });
    }

    handelChangeEvent(event) {

        let newValue;
        let targetId;

        if (event.target.type === 'text' || event.target.type === 'password') {
            newValue = event.target.value;
            targetId = event.target.id;
        }
        if (event.target.type === 'checkbox') {
            newValue = event.target.checked;
            targetId = event.target.id;
        }

        if (event.target.type === 'radio') {
            targetId = event.target.name;
            newValue = event.target.value;
        }

        this.loginForm.fields[targetId].setValue(newValue);
        this.loginForm.fields[targetId].updateValueAndValidity({ emitEvent: true });

    }

```


**NOTE** - *Call updateValueAndValidity function after setValue if you want to Check the particular field is valid or not and also you can send the properties as onlySelf,emitEvent in object. By default they are false. If onlySelf is true, then value inside the main form is not set. If emitEvent is true, then your valueChanges will be call if you have subscribe that observable ( of Form and particular Field )*


**Contribution are Wellcome !**
