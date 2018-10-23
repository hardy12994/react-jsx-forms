This Module helps you to deal with the Forms in **ReactJS**. It gives you very flexible form which will update you state of your Form every time you interact with it and this will save three main actions **( Touched, Dirty, Valid )** of every field form that you can get help in Validation area.

**http://react-jsx-forms.co.in**

**This module will look familiar to those who had done *Angular* Forms 😃.**

**Look in GIF -**


![FormWithPowers](http://res.cloudinary.com/dkws91cqo/image/upload/v1527152960/Webp.net-gifmaker_2_jslufj.gif) 


## What it Provides ?

-  Make the Form Fields enrich and handles in very Smooth way.
-  Verify all Validations for perticular Field in Form.
-  Handel and maintain all the errors.
-  Add Properties like `touched`, `dirty`, `error`, `valid`, `valueChanges` to each field in     form.
-  And Yeah !! It makes sure your form is VALID or NOT.
-  The Cool Thing is, this module uses **`rxjs`** which helps to decide when to do what.

## DEMO's -

### **[FORM BUILDER DEMO]**

### **[FORM GROUP DEMO]**

### **[FORM ARRAY DEMO]**


[FORM BUILDER DEMO]:<http://react-jsx-forms.co.in/form-builder/example>

[FORM GROUP DEMO]:<http://react-jsx-forms.co.in/form-groups/example>

[FORM ARRAY DEMO]:<http://react-jsx-forms.co.in/form-array/example>

## Installation - 

```sh
       npm install --save react-jsx-forms
```

## How to use ?

First you will initialize you form with [FormBuilder]. [FormBuilder] will accept the Form Schema. 

This will provide your form with extra powers like `dirty`, `touched`,`valid`,`observable` etc. These Powers will present in Form and it's Form Fields.

[FormBuilder]:<http://react-jsx-forms.co.in/form-builder>

**[Go to live examples, code and docs!]**

[Go to live examples, code and docs!]:<http://react-jsx-forms.co.in>

### This also provides -

#### [Form Group] 

Grouping multiple forms in hierarchy with [Form Group]. 

Check [form group inbuilt functions] and [form group demo].

[form group inbuilt functions]:<http://react-jsx-forms.co.in/form-groups/methods>

[form group demo]:<http://react-jsx-forms.co.in/form-groups/example>


#### [Form Array] 

If we want to handle list in form, then we will use [Form Array]. 

Check [form array inbuilt functions] and [form array demo].

[form array inbuilt functions]:<http://react-jsx-forms.co.in/form-array/methods>

[form array demo]:<http://react-jsx-forms.co.in/form-array/example>
 

[Form Group]:<http://react-jsx-forms.co.in/form-groups>

[Form Array]:<http://react-jsx-forms.co.in/form-array>


## Validations

All [validations] are set in the Form Schema and all them returns boolean. If it is `true` then your field contain errors otherwise your field is valid.

[validations]:<http://react-jsx-forms.co.in/validations>

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



You can also **[Compose]** your OWN VALIDATION with **`Validators.compose()`**.

[Compose]:<http://react-jsx-forms.co.in/validations>


**NOTE** - *[Read the rules] which can help you make your forms.*

[Read the rules]:<http://react-jsx-forms.co.in/rules-used>


**Contribution are Wellcome !**
