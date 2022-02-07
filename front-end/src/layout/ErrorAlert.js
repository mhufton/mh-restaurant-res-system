// import React from "react";

// /**
//  * Defines the alert message to render if the specified error is truthy.
//  * @param error
//  *  an instance of an object with `.message` property as a string, typically an Error instance.
//  * @returns {JSX.Element}
//  *  a bootstrap danger alert that contains the message string.
//  */

//  function ErrorAlert({ error }) {
//   if (error && error !== null && error.length !== 0) {
//     let messages = Object.values(error)
//     return (
//       messages.map((mes, index) => {
//         return <div key={index} className="alert alert-danger m-2">Error: {mes}</div>
//       })
//     );
//   } else {
//     return null
//   }
// }  

// export default ErrorAlert;


import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  console.log('error in ErrorAlert', error)
  return (
    error && (
      <div className="alert alert-danger m-2">Error: {error.message}</div>
    )
  );
}

export default ErrorAlert;