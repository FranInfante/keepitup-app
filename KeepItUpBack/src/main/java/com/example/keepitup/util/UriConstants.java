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
    // public static final String CONTEXT_PATH = "/api";
    // public static final String VERSION = "/v1";
    public static final String BASE_URL = "/api/v1";

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
    public static final String BY_WORKOUT_ID = "workoutsid/{id}";

    public static final String UNIQUEWORKOUTSBYID = "/unique-names/{userId}";

    public static final String SETLANGUAGEBYID = "/set-language";
    public static final String SETTHEMEBYID = "/set-theme";

    public static final String SEND_EMAIL = "/mail";
    public static final String REGISTER = "/register";
    public static final String VERIFY = "/verify";

    // Plans endpoints
    public static final String PLANS = BASE_URL + "/plans";
    public static final String PLANS_BY_USER_ID = "/user/{userId}";
    public static final String UPDATE_NAME = "/{id}/name";
    public static final String WORKOUTS_IN_PLAN = "/{planId}/workouts";
    public static final String WORKOUT_EXERCISE_IN_PLAN = "/{planId}/workout/{workoutId}/exercise/{exerciseId}";
    public static final String WORKOUT_EXERCISE_IN_PLAN_CREATE = "/{planId}/workouts/{workoutId}/exercise";
    public static final String WORKOUT_IN_PLAN_CREATE = "/{planId}/workouts";
    public static final String WORKOUT_IN_PLAN_DELETE = "/{planId}/workout/{workoutId}";
    public static final String EXERCISES_CREATE = "/check-and-create";

    // Workouts and exercises endpoints
    public static final String WORKOUT_EXERCISES = BASE_URL + "/workoutexercises";
    public static final String WORKOUT_EXERCISES_FOR_WORKOUT = BASE_URL + "/workout/{workoutId}/exercises";
    public static final String EXERCISES = BASE_URL + "/exercises";
    public static final String REORDER = "/{planId}/workouts/reorder";
    public static final String WORKOUTS_BY_USER = "/user/{userId}";

    public static final String MUSCLE_GROUPS = BASE_URL + "/musclegroups";

    public static final String  WORKOUT_LOG = BASE_URL + "/workout-log";
    public static final String  WORKOUT_LOG_EXERCISES = BASE_URL + "/workout-log-exercises";
    public static final String BY_WORKOUT_LOG_ID = "/workout-log/{workoutLogId}";
    public static final String BY_USER_ID = "/user/{userId}";
    public static final String FIND_BY_USER_AND_ISEDITING = "/find-by-user-and-is-editing";
    public static final String EXERCISE_BY_ID = "/exercise/{exerciseId}";
    public static final String BY_WORKOUT_LOG_ID_EXERCISE_ID_AND_SET_NUMBER = "/workout-log/{workoutLogId}/exercise/{exerciseId}/set/{setNumber}";

    public static final String REORDERWORKOUTLOGEXERCISES = "/{workoutLogId}/exercises/reorder";
    public static final String LAST_COMPLETED = "/last-completed/{userId}/{workoutId}";

    public static final String PASSWORD_RESET_REQUEST = "/password-reset/request";
    public static final String PASSWORD_RESET_CONFIRM = "/password-reset/confirm";

    public static final String BY_WORKOUT_LOG_ID_AND_EXERCISE_ID = "/workout-log/{workoutLogId}/exercise/{exerciseId}";


}
