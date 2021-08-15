package com.hcl.capstoneserver.user.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpClientErrorException;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EmailAlreadyExistsException extends HttpClientErrorException {
    public EmailAlreadyExistsException(String email) {
        super(String.format("User with email %s already exits.", email), HttpStatus.BAD_REQUEST, "Email", null, null, null);
    }
}
