package ca.architech.todo.services;

import ca.architech.todo.models.Priority;
import ca.architech.todo.models.TodoItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TodoItemRepository extends MongoRepository<TodoItem, String> {
    TodoItem findByIdAndOwner(String id, String owner);

    List<TodoItem> findByOwner(String owner);

    List<TodoItem> findByPriorityAndOwner(Priority priority, String owner);

    List<TodoItem> findAllByOwnerOrderByDueDateDesc(String owner);

    @Query(value = "{ 'tags' : ?0, 'owner' : ?1 }")
    List<TodoItem> findByTagAndOwner(String tag, String owner);

    @Query(value = "{ 'done': true, 'owner': ?0 }")
    List<TodoItem> findDoneByOwner(String owner);

    @Query(value = "{ 'done': false, 'owner': ?0 }")
    List<TodoItem> findNotDoneByOwner(String owner);
}
