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

import Relay from 'react-relay';

export default class MarkAllTodosMutation extends Relay.Mutation {
  static fragments = {
    // TODO: Mark edges and totalCount optional
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            completed
            id
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id
        totalCount
      }
    `,
  };
  getMutation () {
    return Relay.QL`mutation{markAllTodos}`;
  }
  getFatQuery () {
    return Relay.QL`
      fragment on MarkAllTodosPayload @relay(pattern: true) {
        changedTodos {
          completed
        }
        viewer {
          completedCount
        }
      }
    `;
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        changedTodos: this.props.todos.edges.map(({node}) => node.id),
        viewer: this.props.viewer.id,
      },
    }];
  }
  getVariables () {
    return {
      completed: this.props.completed,
    };
  }
  getOptimisticResponse () {
    const viewerPayload = {id: this.props.viewer.id};
    if (this.props.todos && this.props.todos.edges) {
      viewerPayload.todos = {
        edges: this.props.todos.edges
          .filter(edge => edge.node.completed !== this.props.completed)
          .map(edge => ({
            node: {
              completed: this.props.completed,
              id: edge.node.id,
            },
          })),
      };
    }
    if (this.props.viewer.totalCount != null) {
      viewerPayload.completedCount = this.props.completed ? this.props.viewer.totalCount : 0;
    }
    return {
      viewer: viewerPayload,
    };
  }
}
