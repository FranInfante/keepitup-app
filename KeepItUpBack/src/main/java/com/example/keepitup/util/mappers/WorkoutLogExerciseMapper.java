package com.example.keepitup.util.mappers;



import com.example.keepitup.model.dtos.SetDTO;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.model.entities.Exercise;
import com.example.keepitup.model.entities.WorkoutLog;
import com.example.keepitup.model.entities.WorkoutLogExercise;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class WorkoutLogExerciseMapper {

    public static WorkoutLogExerciseDTO toDTO(WorkoutLogExercise workoutLogExercise) {
        WorkoutLogExerciseDTO dto = new WorkoutLogExerciseDTO();

        dto.setId(workoutLogExercise.getId());
        dto.setExerciseName(workoutLogExercise.getExercise().getName());
        dto.setExerciseId(workoutLogExercise.getExercise().getId());
        dto.setWorkoutLogId(workoutLogExercise.getWorkoutLog().getId());
        dto.setNotes(workoutLogExercise.getNotes() != null ? workoutLogExercise.getNotes() : "");
        dto.setExerciseOrder(workoutLogExercise.getExerciseOrder());


        // Group sets under this exercise
        SetDTO setDTO = new SetDTO(workoutLogExercise.getSet(), workoutLogExercise.getReps(), workoutLogExercise.getWeight());
        dto.setSets(List.of(setDTO));

        return dto;
    }

    public static WorkoutLogExercise toEntity(SetDTO setDTO, WorkoutLogExerciseDTO dto, WorkoutLog workoutLog, Exercise exercise) {
        WorkoutLogExercise exerciseEntity = new WorkoutLogExercise();
        exerciseEntity.setSet(setDTO.getSet());
        exerciseEntity.setReps(setDTO.getReps());
        exerciseEntity.setWeight(setDTO.getWeight());
        exerciseEntity.setWorkoutLog(workoutLog);
        exerciseEntity.setNotes(dto.getNotes());
        exerciseEntity.setExercise(exercise);
        exerciseEntity.setExerciseOrder(dto.getExerciseOrder());


        return exerciseEntity;
    }
}
