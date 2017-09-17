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

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Todo extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object,
    children: PropTypes.object,
    todo: PropTypes.object,

  };

  state = {
    isEditing: false,
  };
  _handleCompleteChange = (e) => {
    const completed = e.target.checked;
    this.props.relay.commitUpdate(
      new ChangeTodoStatusMutation({
        completed,
        todo: this.props.todo,
        viewer: this.props.viewer,
      })
    );
  };
  _handleDestroyClick = () => {
    this._removeTodo();
  };
  _handleLabelDoubleClick = () => {
    this._setEditMode(true);
  };
  _handleTextInputCancel = () => {
    this._setEditMode(false);
  };
  _handleTextInputDelete = () => {
    this._setEditMode(false);
    this._removeTodo();
  };
  _handleTextInputSave = (title) => {
    this._setEditMode(false);
    this.props.relay.commitUpdate(
      new RenameTodoMutation({todo: this.props.todo, title})
    );
  };
  _removeTodo () {
    this.props.relay.commitUpdate(
      new RemoveTodoMutation({todo: this.props.todo, viewer: this.props.viewer})
    );
  }
  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  };
  renderTextInput () {
    return (
      <TodoTextInput
        className="edit"
        commitOnBlur
        initialValue={this.props.todo.title}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    );
  }
  render () {
    return (
      <li
        className={classnames({
          completed: this.props.todo.completed,
          editing: this.state.isEditing,
        })}>
        <div className="view">
          <input
            checked={this.props.todo.completed}
            className="toggle"
            onChange={this._handleCompleteChange}
            type="checkbox"
          />
          <label onDoubleClick={this._handleLabelDoubleClick}>
            {this.props.todo.title}
          </label>
          <button
            className="destroy"
            onClick={this._handleDestroyClick}
          />
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    todo: () => Relay.QL`
      fragment on Todo {
        completed,
        id,
        title,
        ${ChangeTodoStatusMutation.getFragment('todo')},
        ${RemoveTodoMutation.getFragment('todo')},
        ${RenameTodoMutation.getFragment('todo')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        ${ChangeTodoStatusMutation.getFragment('viewer')},
        ${RemoveTodoMutation.getFragment('viewer')},
      }
    `,
  },
});
