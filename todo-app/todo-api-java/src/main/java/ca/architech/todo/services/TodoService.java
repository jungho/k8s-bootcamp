package ca.architech.todo.services;

import ca.architech.todo.models.TodoItem;
import ca.architech.todo.models.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    private TodoItemRepository repository;
    private UserService userService;

    private static final Log logger;

    static {
        logger = LogFactory.getLog(TodoService.class);
    }

    @Autowired
    TodoService(TodoItemRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    public TodoItem createTodo(TodoItem todoItem, String email) {
        logger.info(String.format("Adding a Todo for %s", email));

        todoItem.setOwner(getOwnerId(email));
        return repository.insert(todoItem);
    }

    public List<TodoItem> getTodos(String email) {
        logger.info(String.format("Fetching Todo list for %s", email));

        return repository.findByOwner(getOwnerId(email));
    }

    public Optional<TodoItem> updateTodo(TodoItem todoItem, String email) {
        String id = todoItem.getId();
        logger.info(String.format("Updating Todo item with id = %s, for %s", id, email));

        String owner = getOwnerId(email);
        TodoItem matchingItem = repository.findByIdAndOwner(id, owner);
        if (matchingItem != null) {
            todoItem.setOwner(owner);
            repository.save(todoItem);
            return Optional.of(todoItem);
        }
        return Optional.empty();
    }

    public Optional<TodoItem> deleteTodo(String id, String email) {
        logger.info(String.format("Deleting Todo item with id = %s, for %s", id, email));

        TodoItem matchingItem = repository.findByIdAndOwner(id, getOwnerId(email));
        if (matchingItem != null) {
            repository.delete(id);
        }
        return Optional.ofNullable(matchingItem);
    }

    private String getOwnerId(String email) {
        User user = userService.findUserByEmail(email);
        if (user != null) {
            return user.getId();
        }

        throw new RuntimeException(String.format("User not found - %s", email));
    }
}
