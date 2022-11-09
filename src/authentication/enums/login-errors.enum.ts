export enum LoginErrorsEnum {
  INCORRECT_CREDENTIALS = 'Incorrect credentials',
  USER_WITH_SUCH_EMAIL_DOES_NOT_EXIST = 'User with such email does not exist',
  PENDING_STATUS = 'You have not verified your email',
  WAITING_FOR_ACCESS = 'Your profile has not been verified by the admin yet',
  VERIFIED_STATUS = 'You have been successfully logged in',
}
