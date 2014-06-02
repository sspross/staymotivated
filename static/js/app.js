/**
 * @jsx React.DOM
 */

var WEEKDAYS = ["day1", "day2", "day3", "day4", "day5", "day6", "day0"];

var StayMotivatedTable = React.createClass({
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({week: data[0]});  // TODO concept for more then one week at a time
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {week: null, newTask: null};
  },
  componentWillMount: function() {
    this.loadFromServer();
    // setInterval(this.loadFromServer, this.props.pollInterval);
  },
  addNewTask: function() {
    if (this.state.newTask === null) {
      this.setState({newTask: <TaskForm onTaskCancel={this.cancelNewTask} onTaskSave={this.saveNewTask} />});
    }
  },
  cancelNewTask: function() {
    this.setState({newTask: null});
  },
  saveNewTask: function(name, goal, feasibleDays) {
    // TODO replace this part with server side update, not using setState is evil
    // TOOD why does this work without calling forceUpdate()?
    this.state.week.tasks.push({name: name, goal: goal, achievedDays: [], feasibleDays: feasibleDays});
    this.cancelNewTask();
  },
  handleDayClick: function(key, day) {
    // TODO replace this part with server side update, not using setState() and forceUpdate() is evil
    var task = this.state.week.tasks[key];
    var dayIndex = jQuery.inArray(day, task.achievedDays);
    if (dayIndex >= 0) {
      task.achievedDays.splice(dayIndex, 1);
    } else {
      task.achievedDays.push(day);
    }
    this.forceUpdate();
  },
  render: function() {
    var tasks = [];
    if (this.state.week) {
      var number = this.state.week.number;
      var year = this.state.week.year;
      this.state.week.tasks.forEach(function(task, i) {
          tasks.push(<Task key={i} name={task.name} goal={task.goal} achievedDays={task.achievedDays} feasibleDays={task.feasibleDays} onDayClick={this.handleDayClick} />);
      }.bind(this));
    }
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th rowSpan="2" className="state-col">
              <div className="btn-group">
                <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#"><span className="glyphicon glyphicon-minus"></span><span className="pull-right glyphicon glyphicon-ok"></span></a></li>
                  <li><a href="#"><span className="glyphicon glyphicon-star-empty"></span></a></li>
                  <li><a href="#"><span className="glyphicon glyphicon-star"></span></a></li>
                </ul>
              </div>
            </th>
            <th rowSpan="2" className="task-col">
              Task
              <div className="pull-right">
                <a className="btn btn-default btn-xs" href="#" role="button" onClick={this.addNewTask}><span className="glyphicon glyphicon-plus"></span></a>
              </div>
            </th>
            <th colSpan="7">
              Week {number} - {year}
              <div className="pull-right btn-group">
                <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-chevron-left"></span></a>
                <a className="btn btn-default btn-xs datepicker" href="#" role="button"><span className="glyphicon glyphicon-calendar"></span></a>
                <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-chevron-right"></span></a>
              </div>
            </th>
            <th rowSpan="2" className="goal-col">Goal</th>
          </tr>
          <tr>
            <td className="day-col" title="22.05.2014">Mo</td>
            <td className="day-col" title="22.05.2014">Tu</td>
            <td className="day-col" title="22.05.2014">We</td>
            <td className="day-col" title="22.05.2014">Th</td>
            <td className="day-col" title="22.05.2014">Fr</td>
            <td className="day-col" title="22.05.2014">Sa</td>
            <td className="day-col" title="22.05.2014">Su</td>
          </tr>
        </thead>
        <tbody>
          {this.state.newTask}
          {tasks}
        </tbody>
      </table>
    );
  }
});


var Task = React.createClass({
  render: function() {
    var numAchieved = Object.keys(this.props.achievedDays).length;
    var isCompleted = numAchieved >= this.props.goal ? true : false
    var isOverdone = isCompleted && numAchieved > this.props.goal ? true : false;
    var days = [];
    WEEKDAYS.forEach(function(day) {
      var feasible = jQuery.inArray(day, this.props.feasibleDays) >= 0 ? true : false;
      var achieved = jQuery.inArray(day, this.props.achievedDays) >= 0 ? true : false;
      days.push(<Day taskKey={this.props.key} day={day} feasible={feasible} achieved={achieved} onDayClick={this.props.onDayClick} />);
    }.bind(this));
    return (
      <tr className={isCompleted ? "success" : ""}>
        <td className="state-col"><span className={isCompleted ? "glyphicon glyphicon-star" : "glyphicon glyphicon-star-empty"}></span></td>
        <td>
          {this.props.name}
          <div className="pull-right btn-group hover-btn-group">
            <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-pencil"></span></a>
            <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-trash"></span></a>
          </div>
        </td>
        {days}
        <td>{numAchieved} / {this.props.goal} <span className={isOverdone ? "glyphicon glyphicon-heart" : ""}></span></td>
      </tr>
    );
  }
});


var Day = React.createClass({
  render: function() {
    var tdClass = this.props.feasible ? 'day-col active' : 'day-col';
    var spanClass = this.props.achieved ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';
    return (
      <td className={tdClass} onClick={this.props.onDayClick.bind(null, this.props.taskKey, this.props.day)}>
        <span className={spanClass}></span>
      </td>
    );
  }
});


var TaskForm = React.createClass({
  saveTask: function() {
    var name = this.refs.taskName.getDOMNode().value;
    var goal = this.refs.goal.getDOMNode().value
    var feasibleDays = [];
    WEEKDAYS.forEach(function(day) {
      if (this.refs[day].getDOMNode().checked) {
        feasibleDays.push(day);
      }
    }.bind(this));
    this.props.onTaskSave(name, goal, feasibleDays);
  },
  render: function() {
    var days = [];
    WEEKDAYS.forEach(function(day) {
      days.push(<td className="day-col"><input type="checkbox" ref={day}></input></td>);
    }.bind(this));
    return (
      <tr>
        <td></td>
        <td className="form-inline">
          <input type="text" className="form-control input-sm" ref="taskName" placeholder="Task name...">{this.props.name}</input>
          <div className="pull-right btn-group">
            <button type="submit" className="btn btn-default btn-sm" onClick={this.saveTask}><span className="glyphicon glyphicon-floppy-disk"></span></button>
            <a className="btn btn-default btn-sm" onClick={this.props.onTaskCancel}><span className="glyphicon glyphicon-ban-circle"></span></a>
          </div>
        </td>
        {days}
        <td>
          <input type="number" className="form-control input-sm" ref="goal" placeholder="Goal...">{this.props.goal}</input>
        </td>
      </tr>
    );
  }
});


React.renderComponent(
  <StayMotivatedTable url="/api/weeks.json" pollInterval={2000} />,
  document.getElementById('staymotivated')
);
