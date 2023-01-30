package controllers;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;


import com.fasterxml.jackson.databind.JsonNode;
import dynamodb.DynamoDBClientFactory;
import dynamodb.model.Exercise;
import dynamodb.model.Category;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import utils.DateUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.ArrayList;
import java.util.List;

public class ExerciseController extends Controller {

    private static AmazonDynamoDB client = new DynamoDBClientFactory().createClient();

    @BodyParser.Of(BodyParser.Json.class)
    public Result addExercise() {
        try {
                DynamoDBMapper mapper = new DynamoDBMapper(client);
                JsonNode json = request().body().asJson();

                String exerciseId = json.findPath("exerciseId").textValue();
                if (exerciseId == null) {
                    return badRequest("Missing parameter [exerciseId]");
                } 

                String name = json.findPath("name").textValue();
                String description1 = json.findPath("description1").textValue();
                String description2 = json.findPath("description2").textValue();
                String imageUrl = json.findPath("imageUrl").textValue();
                String videoUrl = json.findPath("videoUrl").textValue();
                String status = json.findPath("status").textValue();
                String categoryId = json.findPath("categoryId").textValue();
                int cntExercise=0;
                Exercise exercise = mapper.load(Exercise.class, exerciseId);
                if (exercise != null) {
                    return badRequest("Exercise already exist");
                }

                exercise = new Exercise();
                exercise.setExerciseId(exerciseId);
                exercise.setName(name);
                exercise.setDescription1(description1);
                exercise.setDescription2(description2);
                exercise.setStatus(status);
                exercise.setImageUrl(imageUrl);
                exercise.setVideoUrl(videoUrl);
                exercise.setCategoryId(categoryId);
                exercise.setCreationDate(DateUtils.getCurrentDateTime());
                mapper.save(exercise);


                if(!categoryId.equals("0")){
                    Map<String, AttributeValue> eav = new HashMap<>();
                    eav.put(":val1", new AttributeValue().withS(categoryId));
                    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                            .withFilterExpression("CategoryId = :val1")
                            .withExpressionAttributeValues(eav);

                    List<Exercise> scanResult = mapper.scan(Exercise.class, scanExpression);
                    List<Exercise> filteredResult = scanResult.stream()
                    .filter(cat -> cat.isDeleted() == false)
                    .filter(cat -> cat.getStatus().equals("Publish"))
                    .collect(Collectors.toList());
                    System.out.println(filteredResult.size()+"TOTAL SUb"+(Json.toJson(scanResult)));
                    cntExercise =filteredResult.size();
                    Category parentCategory = mapper.load(Category.class, categoryId);
                    parentCategory.setCntExercise(cntExercise);
                    mapper.save(parentCategory);
                }
                return ok();
        } catch (Throwable t) {
            t.printStackTrace();
            return internalServerError(t.getMessage());
        }
    }
     	
     
    public Result getExercise() {
        DynamoDBMapper mapper = new DynamoDBMapper(client);
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<Exercise> exercise = mapper.scan(Exercise.class, scanExpression);
        
        return ok(Json.toJson(exercise));
    }
    public Result getExercises() {
        DynamoDBMapper mapper = new DynamoDBMapper(client);
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<Exercise> category = mapper.scan(Exercise.class, scanExpression);

        JsonNode json = request().body().asJson();
        String categoryId = json.findPath("categoryId").textValue();

        List<Exercise> mainFilteredResult = category.stream()
        .filter(cat -> cat.isDeleted() == false)
        .filter(cat -> cat.getStatus().equals("Publish"))
        .filter(cat -> cat.getParentId().equals(categoryId))
        .collect(Collectors.toList());
        
        return ok(Json.toJson(mainFilteredResult));
    }
 
    @BodyParser.Of(BodyParser.Json.class)
    public Result updateExercise() {
        DynamoDBMapper mapper = new DynamoDBMapper(client);
        JsonNode json = request().body().asJson();

        String exerciseId = json.findPath("exerciseId").textValue();
        if (exerciseId == null) {
            return badRequest("Missing parameter [exerciseId]");
        }

        String name = json.findPath("name").textValue();
        String description1 = json.findPath("description1").textValue();
        String description2 = json.findPath("description2").textValue();
        String imageUrl = json.findPath("imageUrl").textValue();
        String videoUrl = json.findPath("videoUrl").textValue();
        String status = json.findPath("status").textValue();
        String categoryId = json.findPath("categoryId").textValue();
        int cntExercise=0;
        try {
            Exercise exercise = mapper.load(Exercise.class, exerciseId);
            if (exercise == null) {
                return badRequest("Exercise does not exist");
            }
            exercise.setName(name);
            exercise.setDescription1(description1);
            exercise.setDescription2(description2);
            exercise.setStatus(status);
            exercise.setImageUrl(imageUrl);
            exercise.setVideoUrl(videoUrl);
            exercise.setCategoryId(categoryId);
            exercise.setCreationDate(DateUtils.getCurrentDateTime());
            mapper.save(exercise);


            if(!categoryId.equals("0")){
                    Map<String, AttributeValue> eav = new HashMap<>();
                    eav.put(":val1", new AttributeValue().withS(categoryId));
                    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                            .withFilterExpression("CategoryId = :val1")
                            .withExpressionAttributeValues(eav);

                    List<Exercise> scanResult = mapper.scan(Exercise.class, scanExpression);
                    List<Exercise> filteredResult = scanResult.stream()
                    .filter(cat -> cat.isDeleted() == false)
                    .filter(cat -> cat.getStatus().equals("Publish"))
                    .collect(Collectors.toList());
                    System.out.println(filteredResult.size()+"TOTAL SUb"+(Json.toJson(scanResult)));
                    cntExercise =filteredResult.size();
                    Category parentCategory = mapper.load(Category.class, categoryId);
                    parentCategory.setCntExercise(cntExercise);
                    mapper.save(parentCategory);
                }
            return ok();
        } catch (Throwable t) {
            t.printStackTrace();
            return internalServerError(t.getMessage());
        }
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result deleteExercise() {
        DynamoDBMapper mapper = new DynamoDBMapper(client);
        JsonNode json = request().body().asJson();

        String exerciseId = json.findPath("exerciseId").textValue();
        if(exerciseId == null) {
            return badRequest("Missing parameter [exerciseId]");
        }


        // DynamoDB dynamoDB = new DynamoDB(client);
        // Table table = dynamoDB.getTable("Gymiles-Exercise");
        // DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
        //     .withPrimaryKey(new PrimaryKey("exerciseId", exerciseId));
        // try {
        //     System.out.println("Attempting a conditional delete...");
        //     table.deleteItem(deleteItemSpec);
        //     System.out.println("DeleteItem succeeded");
        //     return ok();
        // }
        // catch (Throwable t) {
        //     return internalServerError(t.getMessage());
        // }
        try {
            Exercise category = mapper.load(Exercise.class, exerciseId);
            if (category == null) {
                return badRequest("Exercise does not exist: " + exerciseId);
            }
            category.setDeleted(true);
            mapper.save(category);
            return ok();
        } catch (Throwable t) {
            t.printStackTrace();
            return internalServerError(t.getMessage());
        }
    }

}
