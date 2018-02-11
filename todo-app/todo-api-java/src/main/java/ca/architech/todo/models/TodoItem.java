package ca.architech.todo.models;

import ca.architech.todo.models.Priority;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "todos")
@ApiModel(description = "A Todo item belonging to the current user")
public class TodoItem {
    @ApiModelProperty(value = "The Id of this Todo item")
    private String id;

    @ApiModelProperty(value = "The Id of the current user")
    private String owner;

    @ApiModelProperty(value = "Information about this Todo item", required = true)
    private String description;

    @ApiModelProperty(value = "Has this Todo item been completed")
    private boolean done;

    @ApiModelProperty(value = "The priority of this Todo item")
    private Priority priority;

    @ApiModelProperty(value = "When is this Todo item due", required = true)
    private LocalDate dueDate;

    @ApiModelProperty(value = "Tags associated to this Todo item")
    private List<String> tags;

    public void addTag(String tag) {
        tags.add(tag);
    }

}
