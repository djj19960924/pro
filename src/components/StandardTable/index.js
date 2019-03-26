import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) { 
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      showAlert: true,
      opacityShow: true,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  colseAlert = () => {
    this.setState({
      opacityShow: false,
    });
    setTimeout(() => {
      this.setState({
        showAlert: false,
      });
    }, 500);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      showRowSelect,
      expandedRowRender,
      total,
      showPagination,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    let rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    if (showRowSelect === 'none') {
      rowSelection = null;
    }

    for (let i = 0; i < list.length; i++) {
      list[i].key = list[i].id;
    }

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert} style={this.state.opacityShow ? {} : { opacity: 0 }}>
          {/* <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          /> */}
          <Alert
            style={this.state.showAlert ? {} : { display: 'none' }}
            message={
              <Fragment>
                <b>
                  当前共 <span style={{ color: '#3F99EE' }}>{total}</span> 条数据
                </b>
                <a onClick={this.colseAlert} style={{ marginLeft: 24 }}>
                  关闭
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={showPagination=='none'?false:paginationProps}
          onChange={this.handleTableChange}
          expandedRowRender={expandedRowRender}
          size="middle"
        />
      </div>
    );
  }
}

export default StandardTable;
