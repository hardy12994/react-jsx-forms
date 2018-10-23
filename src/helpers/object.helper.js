// export let compareObj = function (obj1, obj2) {
//     //Loop through properties in object 1
//     for (let p in obj1) {

//         //Check property exists on both objects
//         // if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
//         if (!obj2.hasOwnProperty(p)) return false;

//         switch (typeof (obj1[p])) {
//             //Deep compare objects
//             case 'object':
//                 if (!compareObj(obj1[p], obj2[p])) return false;
//                 break;
//             //Compare function code
//             case 'function':
//                 if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
//                 break;
//             //Compare values
//             default:
//                 if (obj1[p] != obj2[p]) return false;
//         }
//     }

//     //Check object 2 for any extra properties
//     for (let p in obj2) {
//         if (typeof (obj1[p]) == 'undefined') return false;
//     }
//     return true;
// };


export let compareObj = function (obj1, obj2) {

    if (typeof obj1 == 'string' && typeof obj2 == 'string') return true;

    for (const key in obj1) {

        if (!obj2.hasOwnProperty(key)) return false;

        if (typeof (obj1[key]) === 'object') {
            compareObj(obj1[key], obj2[key]);
        }
    }

    let resultForObj2 = checkForObj2(obj1, obj2);

    return resultForObj2;
};


let checkForObj2 = function (obj1, obj2) {

    //Check object 2 for any extra properties
    for (let key in obj2) {

        if (typeof (obj1[key]) == 'undefined') return false;

        if (typeof (obj2[key]) === 'object') {

            checkForObj2(obj1[key], obj2[key]);

        }
    }

    return true;
};