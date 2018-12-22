document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/') {
        formatPhoneNumber('#rsvpForm input[name=phoneNumber]');
        trimFields();
    }
});

var enumsCheck = Object.freeze({
    0: 'input[name=firstName]',
    1: 'input[name=lastName]',
    2: 'input[name=email]',
    3: 'input[name=phoneNumber]',
    4: 'select'
});

/**
 * Determines if there is a value in form
 * input fields for first and last name
 * parameter takes in querySelector
 * @param {string} query
 * Output: @boolean
 */
function nameFields(query) {
    var $nameInput = document.querySelector(query);

    return $nameInput.value.trim().length >= 3 ? true : false;
}

/**
 * Email validation
 * @param {string} query
 * Output: @boolean
 */
function emailValidation(query) {
    var emailRegex = RegExp('^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$', 'g');
    var $emailInput = document.querySelector(query);

    return emailRegex.test($emailInput.value);
}

/**
 * Check if user has typed
 * sufficient amount of characters
 * and they are numbers
 * @param {string} query
 * Output: @boolean
 */
function phoneNumberValidation(query) {
    var $phoneInput = document.querySelector(query);
    var phoneVal = $phoneInput.value.replace(/[- )(]/g, '');

    return phoneVal.length === 10 && !isNaN(parseInt(phoneVal)) ? true : false;
}

/**
 * Check that user has selected
 * a numeric value other
 * than default value
 * @param {string} query
 * Output: @boolean
 */
function guestCountValidation(query) {
    var $selectOption = document.querySelector(query);

    return $selectOption.value !== 'Select' ? true : false;
}

/**
 * Formats tel input with regex
 * Input will only accept numbers
 * and limit to 10 digits
 * @param {string} query
 */
function formatPhoneNumber(query) {
    document.querySelector(query).addEventListener('input', function (e) {
        var phoneRegex = /(\d{0,3})(\d{0,3})(\d{0,4})/;
        var telValue = e.target;

        var newVal = telValue.value.replace(/\D/g, '').match(phoneRegex);
        telValue.value = !newVal[2] ? newVal[1] : '(' + newVal[1] + ') ' + newVal[2] + (newVal[3] ? ' - ' + newVal[3] : '');
    });
}

function validateForm() {
    var validForm = [
        nameFields('#rsvpForm input[name=firstName]'),
        nameFields('#rsvpForm input[name=lastName]'),
        emailValidation('#rsvpForm input[type=email]'),
        phoneNumberValidation('#rsvpForm input[type=tel]'),
        guestCountValidation('#rsvpForm select')
    ];

    var doNotSend = 0;

    for (var index = 0; index < validForm.length; index++) {
        var $errorInput = document.querySelector('#rsvpForm ' + enumsCheck[index] + ' + div');
        var $inputField = document.querySelector('#rsvpForm ' + enumsCheck[index]);

        if (validForm[index] === false) {
            doNotSend += 1;
            $inputField.style.border = '1px solid #E1261C';
            $errorInput.classList.add('active')
        } else {
            $inputField.style.border = '1px solid #E6E6E6';
            $errorInput.classList[0].remove('error-display')
        }
    }

    return doNotSend > 0 ? false : true;
}

function trimFields() {
    var $inputFields = document.getElementsByTagName('input');
    for (var index = 0; index < $inputFields.length; index++) {
        var input = $inputFields[index];

        input.addEventListener('change', function (e) {
            var inputValue = e.target;
            inputValue.value = inputValue.value.trim();

            if (inputValue.name === 'firstName' || inputValue.name === 'lastName') {
                inputValue.value = inputValue.value.charAt(0).toUpperCase() + inputValue.value.slice(1);
            }
        });
    }
}