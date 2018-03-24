package ca.architech.todo.api;

import ca.architech.todo.models.TodoItem;
import ca.architech.todo.services.TodoService;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import io.swagger.annotations.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@Api(description = "Endpoints to Manage Todo List")
public class TodoItemController {
    private static final Log logger;

    static {
        logger = LogFactory.getLog(TodoItemController.class);
    }

    private TodoService todoService;

    @Autowired
    public TodoItemController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping(value = "/healthcheck")
    @ApiOperation(value = "Used to ping the Todo API")
    @ApiResponse(code = 200, message = "API is running")
    public ResponseEntity<HttpStatus> healthCheck() {
        logger.info("Received a health-check request from K8S.");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping()
    @ApiOperation(value = "Returns the Todo items of the current user", response = TodoItem.class, responseContainer = "List")
    @ApiResponses({
        @ApiResponse(code = 200, message = "Successfully fetched all Todo items"),
        @ApiResponse(code = 500, message = "Unexpected error when fetching the Todo items")
    })
    public ResponseEntity<List<TodoItem>> getTodoItems(@ApiIgnore PreAuthenticatedAuthenticationToken authToken) {
        try {
            List<TodoItem> todoItems = todoService.getTodos(getEmail(authToken));
            logger.info(String.format("Returning %d Todo items", todoItems.size()));
            return new ResponseEntity<>(todoItems, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error when fetching Todo items", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping()
    @ApiOperation(value = "Updates a Todo item of the current user", response = TodoItem.class)
    @ApiResponses({
        @ApiResponse(code = 200, message = "Todo item successfully updated"),
        @ApiResponse(code = 404, message = "The specified Todo item is not found"),
        @ApiResponse(code = 500, message = "Unexpected error when updating a Todo item")
    })
    public ResponseEntity<TodoItem> updateTodoItem(@RequestBody TodoItem todoItem,
            @ApiIgnore PreAuthenticatedAuthenticationToken authToken) {
        try {
            Optional<TodoItem> updatedItem = todoService.updateTodo(todoItem, getEmail(authToken));
            if (!updatedItem.isPresent()) {
                logger.info(String.format("Todo item is not found - %s", todoItem.getId()));
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            logger.info(String.format("Todo item is successfully updated - %s", todoItem.getId()));
            return new ResponseEntity<>(updatedItem.get(), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error when updating a Todo item", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    @ApiOperation(value = "Creates a Todo item for the current user", response = TodoItem.class)
    @ApiResponses({
        @ApiResponse(code = 201, message = "The Todo item is created successfully"),
        @ApiResponse(code = 500, message = "Unexpected error when creating a Todo item")
    })
    public ResponseEntity<TodoItem> createTodoItem(@RequestBody TodoItem todoItem,
            @ApiIgnore PreAuthenticatedAuthenticationToken authToken, @ApiIgnore HttpServletResponse response) {
        try {
            TodoItem newItem = todoService.createTodo(todoItem, getEmail(authToken));
            logger.info(String.format("New Todo item is successfully created - %s", newItem.getId()));
            return new ResponseEntity<>(newItem, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error when creating a new Todo item", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Deletes a Todo item of the current user", response = TodoItem.class)
    @ApiResponses({
        @ApiResponse(code = 202, message = "The Todo item is deleted successfully"),
        @ApiResponse(code = 404, message = "The specified Todo item is not found"),
        @ApiResponse(code = 500, message = "Unexpected error when deleting a Todo item")
    })
    public ResponseEntity<TodoItem> deletePost(@PathVariable @ApiParam(value = "Todo ID", required = true) String id,
            @ApiIgnore PreAuthenticatedAuthenticationToken authToken) {
        try {
            Optional<TodoItem> deletedItem = todoService.deleteTodo(id, getEmail(authToken));
            if (!deletedItem.isPresent()) {
                logger.info(String.format("Todo item is not found - %s", id));
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            logger.info(String.format("Todo item is successfully deleted - %s", id));
            return new ResponseEntity<>(deletedItem.get(), HttpStatus.ACCEPTED);
        } catch (Exception e) {
            logger.error("Error when deleting a new Todo item", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getEmail(PreAuthenticatedAuthenticationToken authToken) {
        UserPrincipal userPrincipal = (UserPrincipal) authToken.getPrincipal();
        Map<String, Object> claims = userPrincipal.getClaims();
        return (String) claims.get("email");
    }
}
