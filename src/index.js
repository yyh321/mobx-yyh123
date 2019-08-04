import { observable, action, computed } from "mobx";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { PropTypes as ObservableProptypes, observer } from "mobx-react";

class Todo {
  id = Math.random();
  @observable title = "";
  @observable finished = false;
  constructor(title) {
    this.title = title;
  }

  @action.bound toggle() {
    this.finished = !this.finished;
  }
}

class Store {
  @observable todos = [];

  @action.bound createTodo(title) {
    this.todos.unshift(new Todo(title));
  }

  @computed get left() {
    return this.todos.filter(todo => !todo.finished).length;
  }
}
var store = new Store();

@observer
class TodoItem extends Component {
  static propTypes = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    finished: PropTypes.bool.isRequired
  }).isRequired;

  handleClick = e => {
    this.props.todo.toggle();
  };
  render() {
    const todo = this.props.todo;
    return (
      <>
        <input
          type="checkbox"
          className="toggle"
          checked={todo.finished}
          onClick={this.handleClick}
        />
        <span className="title"> {todo.title} </span>
      </>
    );
  }
}

@observer
class TodoList extends Component {
  static propTypes = {
    store: PropTypes.shape({
      createTodo: PropTypes.func,
      todos: ObservableProptypes.observableArrayOf(
        ObservableProptypes.observableObject
      ).isRequired
    }).isRequired
  };

  state = { inputValue: "" };

  handleSubmit = e => {
    e.preventDefault();

    var store = this.props.store;
    var inputValue = this.state.inputValue;
    store.createTodo(inputValue);
    this.setState({ inputValue: "" });
  };

  handleChange = e => {
    var inputValue = e.target.value;
    this.setState({
      inputValue
    });
  };

  render() {
    const store = this.props.store;
    const todos = store.todos;
    return (
      <div className="todo-list">
        <header>
          <form onSubmit={this.handleSubmit}>
            <input
              className="input"
              placeholder="What needs to be finished?"
              type="text"
              onChange={this.handleChange}
              value={this.state.inputValue}
            />
          </form>
        </header>
        <ul>
          {todos.map(todo => {
            return (
              <li key={todo.id} className="todo-item">
                {" "}
                <TodoItem todo={todo} />{" "}
              </li>
            );
          })}
        </ul>
        <footer>{store.left} item(s) unfinished</footer>
      </div>
    );
  }
}

ReactDOM.render(<TodoList store={store} />, document.getElementById("root"));
