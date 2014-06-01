/**
 * @jsx React.DOM
 */
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
    if (this.state.newTask === null)
      this.setState({newTask: <TaskForm onTaskCancel={this.cancelNewTask} />})
  },
  cancelNewTask: function() {
    this.setState({newTask: null});
  },
  render: function() {
    var tasks = [];
    if (this.state.week) {
      var number = this.state.week.number;
      var year = this.state.week.year;
      this.state.week.tasks.forEach(function(task) {
          var achieved = Object.keys(task.achievedDays).length;
          var completed = achieved >= task.goal ? true : false
          tasks.push(<Task id={task.id} name={task.name} goal={task.goal} completed={completed} achieved={achieved} achievedDays={task.achievedDays} feasibleDays={task.feasibleDays} />);
      });
    }
    return (
      <table className="table table-striped table-bordered table-hover">
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
    var days = [];
    for (var i = 0; i <= 6; i++) {
      var day = (i + 1) % 7;
      var feasible = this.props.feasibleDays["day" + day] ? true : false;
      var achieved = this.props.achievedDays["day" + day] ? true : false;
      days.push(<Day taskId={this.props.id} day={day} feasible={feasible} achieved={achieved} />);
    };
    return (
      <tr>
        <td className="state-col"><span className={this.props.completed ? "glyphicon glyphicon-star" : "glyphicon glyphicon-star-empty"}></span></td>
        <td>
          {this.props.name}
          <div className="pull-right btn-group hover-btn-group">
            <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-pencil"></span></a>
            <a className="btn btn-default btn-xs" href="#" role="button"><span className="glyphicon glyphicon-trash"></span></a>
          </div>
        </td>
        {days}
        <td>{this.props.achieved} / {this.props.goal}</td>
      </tr>
    );
  }
});


var Day = React.createClass({
  switchDay: function(target) {
    console.log(this.props.taskId, this.props.day);
  },
  render: function() {
    return (
      <td className={this.props.feasible ? 'day-col info' : 'day-col'}><a href="#" onClick={this.switchDay} role="button"><span className={this.props.achieved ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked'}></span></a></td>
    );
  }
});

var TaskForm = React.createClass({
  cancelTask: function() {
    this.props.onTaskCancel();
  },
  saveTask: function() {
    console.log(this.refs.taskName.getDOMNode().value);
    console.log(this.refs.goal.getDOMNode().value);
    console.log(this.refs.day0.getDOMNode().checked);
    console.log(this.refs.day1.getDOMNode().checked);
    console.log(this.refs.day2.getDOMNode().checked);
    console.log(this.refs.day3.getDOMNode().checked);
    console.log(this.refs.day4.getDOMNode().checked);
    console.log(this.refs.day5.getDOMNode().checked);
    console.log(this.refs.day6.getDOMNode().checked);
  },
  render: function() {
    return (
      <tr>
        <td></td>
        <td className="form-inline">
          <input type="text" className="form-control input-sm" ref="taskName" placeholder="Task name...">{this.props.name}</input>
          <div className="pull-right btn-group">
            <button type="submit" className="btn btn-default btn-sm" onClick={this.saveTask}><span className="glyphicon glyphicon-floppy-disk"></span></button>
            <a className="btn btn-default btn-sm" onClick={this.cancelTask}><span className="glyphicon glyphicon-ban-circle"></span></a>
          </div>
        </td>
        <td className="day-col"><input type="checkbox" ref="day1"></input></td>
        <td className="day-col"><input type="checkbox" ref="day2"></input></td>
        <td className="day-col"><input type="checkbox" ref="day3"></input></td>
        <td className="day-col"><input type="checkbox" ref="day4"></input></td>
        <td className="day-col"><input type="checkbox" ref="day5"></input></td>
        <td className="day-col"><input type="checkbox" ref="day6"></input></td>
        <td className="day-col"><input type="checkbox" ref="day0"></input></td>
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
