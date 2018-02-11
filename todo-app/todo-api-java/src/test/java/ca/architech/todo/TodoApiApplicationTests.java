package ca.architech.todo;

import ca.architech.todo.models.Priority;
import ca.architech.todo.models.TodoItem;
import ca.architech.todo.services.TodoItemRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TodoApiApplicationTests {

	@Autowired
	private TodoItemRepository repository;

	@Value("${FAIL_TESTS:false}") boolean failTests;

	@Before
	public void setUp() {
		LocalDate now = LocalDate.now();

		TodoItem item1 = new TodoItem("123456789",
				"123456789", //owner
				"Test Item", //description
				false,
				Priority.HIGH,
				now.plusDays(7), //dueDate
				Arrays.asList("test"));

		TodoItem item2 = new TodoItem("234567890",
				"234567890",
				"Read policies by end of week.",
				false,
				Priority.HIGH,
				now.plusWeeks(4),
				Arrays.asList("policy, HR"));

		TodoItem item3 = new TodoItem("345678901",
				"345678901",
				"Finish K8S bootcamp outline.",
				true,
				Priority.HIGH,
				now.plusDays(5),
				Arrays.asList("K8S", "training"));

		repository.save(Arrays.asList(item1, item2, item3));

	}

	@Test
	public void findById() {

		List<TodoItem> items = repository.findAll();
		assert(!items.isEmpty());

		String id = "123456789";
		TodoItem item = repository.findByIdAndOwner(id, id);

		assertThat(item.getId()).isEqualTo(id);
	}

	@Test
	public void findByTag() {
		assert(!repository.findAll().isEmpty());

		String tag = "training";
		List<TodoItem> items = repository.findByTagAndOwner(tag, "345678901");

		assertThat(items).hasSize(1);
	}

	@Test
	public void findDone() {
		assertThat(repository.findDoneByOwner("345678901")).size().isEqualTo(1);
	}

	@Test
	public void findNotDone() {
		assertThat(repository.findNotDoneByOwner("123456789")).size().isEqualTo(1);
	}

	/**
	 * Useful to fail the testing phase of a build process for demonstration purposes.
	 */
	@Test
	public void failTest() {
		assertThat(failTests).isFalse();
	}
}
