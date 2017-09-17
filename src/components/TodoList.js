/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';
import Relay from 'react-relay';
import PropTypes from 'prop-types';

class TodoList extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object,
    children: PropTypes.object,
  };
  _handleMarkAllChange = (e) => {
    const completed = e.target.checked;
    this.props.relay.commitUpdate(
      new MarkAllTodosMutation({
        completed,
        todos: this.props.viewer.todos,
        viewer: this.props.viewer,
      })
    );
  };
  renderTodos () {
    return this.props.viewer.todos.edges.map(edge =>
      <Todo
        key={edge.node.id}
        todo={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render () {
    const numTodos = this.props.viewer.totalCount;
    const numCompletedTodos = this.props.viewer.completedCount;
    return (
      <section className="main">
        <input
          checked={numTodos === numCompletedTodos}
          className="toggle-all"
          onChange={this._handleMarkAllChange}
          type="checkbox"
        />
        <label htmlFor="toggle-all">
          Mark all as completed
        </label>
        <ul className="todo-list">
          {this.renderTodos()}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(TodoList, {
  initialVariables: {
    status: null,
  },

  prepareVariables ({status}) {
    let nextStatus;
    if (status === 'active') {
      nextStatus = 'false';
    } else if (status === 'completed') {
      nextStatus = 'true';
    } else {
      // This matches the Backbone example, which displays all todos on an
      // invalid route.
      nextStatus = 'any';
    }
    return {
      status: nextStatus,
    };
  },
  // first: 2147483647  # max GraphQLInt
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        completedCount,
        todos(
          status: $status,
          first: 30  # max GraphQLInt

        ) {
          edges {
            node {
              id,
              ${Todo.getFragment('todo')},
            },
          },
          ${MarkAllTodosMutation.getFragment('todos')},
        },
        totalCount,
        ${MarkAllTodosMutation.getFragment('viewer')},
        ${Todo.getFragment('viewer')},
      }
    `,
  },
});
