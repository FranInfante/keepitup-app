package com.example.keepitup.util.exceptions;

import com.example.keepitup.util.msgs.MessageConstants;

public class UserException extends Exception {
    public UserException(String s) {
        super(s);
    }

    public static UserException userNameExistingException() {
        return new UserException(MessageConstants.EXISTING_USER);
    }

    public static UserException emailExistingException() {
        return new UserException(MessageConstants.EXISTING_MAIL);
    }


    public static UserException failedUpdate() {
        return new UserException(MessageConstants.MODIFY_USER_ERROR);
    }
}
