package com.example.keepitup.util;

public class UriConstants {
     public static final String HOST = System.getenv("SERVER_HOST") != null 
                                      ? System.getenv("SERVER_HOST") 
                                      : "http://localhost";

    public static final String PORT = System.getenv("SERVER_PORT") != null 
                                      ? System.getenv("SERVER_PORT") 
                                      : "8080";

    public static final String ANGULAR_PORT = System.getenv("ANGULAR_PORT") != null
                                              ? System.getenv("ANGULAR_PORT")
                                              : "4200";
    public static final String ANGULAR_HOST = HOST + ANGULAR_PORT;
    public static final String CONTEXT_PATH = "/api";
    public static final String VERSION = "/v1";
    public static final String BASE_URL = CONTEXT_PATH + VERSION;

    // Users endpoints
    public static final String USERS = BASE_URL + "/users";
    public static final String USERS_SEARCH = "/search";
    public static final String USERS_LOGIN = "/login";
    public static final String USERS_AUTH = "/authenticate";
    public static final String USERS_INFO = "/information";


    public static final String INFO = BASE_URL + "/info";
    public static final String WEIGHINS = BASE_URL + "/weighins";
    public static final String WORKOUTS = BASE_URL + "/workouts";

    public static final String BY_ID = "/{id}";

    public static final String UNIQUEWORKOUTSBYID = "/unique-names/{userId}";


}
