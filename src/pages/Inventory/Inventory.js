import React from 'react';
import items from '../../apis/items';
import Page from '../../components/Page';
import NewItemModal from './components/NewItemModal';
import columns from './columns';

class Inventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      searchInput: '',
      data: null,
    }

    this.debouncedSearch = this.debouncedSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  async componentDidMount() {
    const { data } = await items.getAll();
    this.setState({
      tableData: data
    });

    const itemData = await items.get(1);
    this.setState({ data: itemData.data });
  }

  async debouncedSearch({ target }) {
    if(target.timer) clearTimeout(target.timer);
    target.timer = setTimeout(() => this.handleSearch(target.value), 1000);
  }

  async handleSearch(input) {
    const { data } = await items.filter(input);
    this.setState({
      tableData: data
    });
  }

  render() {
    const { tableData } = this.state;

    return (
      <Page
        headerProps={{
          title: 'Inventory',
          hasNewButton: true,
        }}
        searchBarProps={{
          placeholder: 'Search by item name or SKU',
          onChange: this.debouncedSearch,
          onSearch: this.handleSearch,
        }}
        tableProps={{
          columns: columns,
          dataSource: tableData,
          rowKey: 'id',
          pagination: {
            position: ['bottomRight'],
            defaultPageSize: 10,
          },
        }}
        Modal={NewItemModal}
      >
        <NewItemModal 
          footer={null}
          maskClosable={false}
          destroyOnClose={true}
          visible={true}
          // showModal={showModal}
          // hideModal={hideModal}
          editing
          data={this.state.data}
        />
      </Page>
    )
  }
}

export default Inventory;