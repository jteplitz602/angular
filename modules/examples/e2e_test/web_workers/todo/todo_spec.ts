import {verifyNoBrowserErrors} from 'angular2/src/test_lib/e2e_util';
import {Promise} from 'angular2/src/facade/async';

describe('WebWorkers Todo', function() {
  afterEach(verifyNoBrowserErrors);

  var URL = "examples/src/web_workers/todo/index.html";

  it('should bootstrap', () => {
    browser.get(URL);

    waitForBootstrap();
    expect(element(by.css("#todoapp header")).getText()).toEqual("todos");
  });

  it('should add a task', () => {
    browser.get(URL);
    var taskText = "Test task";

    waitForBootstrap();
    addTask(taskText);
    var listItem = element.all(by.css("#todo-list li")).first();
    var label = listItem.element(by.css("label"));
    expect(label.getText()).toEqual(taskText);
  });

  it('should clear completed', () => {
    browser.get(URL);

    waitForBootstrap();
    addTask("Task 1");
    addTask("Task 2");
    expect(element.all(by.css("#todo-list li")).count()).toEqual(2);

    var checkbox = element.all(by.css("#todo-list li")).first().element(by.css("input.toggle"));
    checkbox.click();
    element(by.css("#clear-completed")).click();
    var condition = new protractor.until.Condition<boolean>("Task didn't get cleared", (driver) => {
      return element.all(by.css("#todo-list li")).count().then((count) => { return count == 1; });
    });

    var label = element.all(by.css("#todo-list li")).first().element(by.css("label"));
    expect(label.getText()).toEqual("Task 2");
  });
});

function addTask(taskText: string): void {
  var todoInput = element(by.css("#new-todo"));

  element(by.css("#new-todo")).sendKeys(protractor.Key.ENTER);

  todoInput.sendKeys(taskText);
  todoInput.sendKeys(protractor.Key.ENTER);

  browser.wait(protractor.until.elementLocated(by.css("#todo-list li")), 5000);
}

function waitForBootstrap(): void {
  browser.wait(protractor.until.elementLocated(by.css("todo-app #todoapp")), 5000);
}
