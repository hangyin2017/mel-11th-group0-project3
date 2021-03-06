import validator from 'validator';
import auth from '../../../../apis/auth';
import debounce from '../../../../utils/debounce';

const debouncedCheckUsername = debounce(auth.checkUsername, 1000);
const debouncedCheckEmail = debounce(auth.checkEmail, 1000);

const FIELDS = [{
  key: 'username',
  label: 'Username',
  type: 'text',
  validations: [{
    message: 'Please enter your username',
    validator: (value) => !validator.isEmpty(value),
  },{
    message: 'Username must be at least 6 characters',
    validator: (value) => validator.isLength(value, { min: 6 }),
  },{
    message: 'Username already exists',
    validator: (value) => {
      if(!!value && value.length >= 6) {
        return debouncedCheckUsername({ username: value })
          .then((res) => true)
          .catch((err) => false);
      }
      return true;
    },
  }],
},{
  key: 'email',
  label: 'Email',
  type: 'text',
  validations: [{
    message: 'Please enter your email address',
    validator: (value) => !validator.isEmpty(value),
  },{
    message: 'Please enter a valid email address',
    validator: (value) => validator.isEmail(value),
  },{
    message: 'Email already exists',
    validator: (value) => {
      return debouncedCheckEmail({ email: value })
        .then((res) => true)
        .catch((err) => false);
    },
  }],
},{
  key: 'password',
  label: 'Password',
  type: 'password',
  validations: [{
    message: 'Please enter your password',
    validator: (value) => !validator.isEmpty(value),
  },{
    message: 'Password must be at least 8 characters',
    validator: (value) => validator.isLength(value, { min: 8 }),
  }],
},{
  key: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  validations: [{
    message: 'Please confirm your password',
    validator: (value) => !validator.isEmpty(value),
  },{
    message: 'Confirmed password does not match the password',
    validator: (value, data) => value === data.password.value,
  }],
}];

export default FIELDS;