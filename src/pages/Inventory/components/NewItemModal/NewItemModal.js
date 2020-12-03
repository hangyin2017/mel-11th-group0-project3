import React from 'react';
import { Input, Divider, message } from 'antd';
import items from '../../../../apis/items';
import Modal from '../../../../components/Modal';
import Form from '../../../../components/Form';
import SimpleFooter from '../../../../components/Form/components/SimpleFooter';
import PrimaryInfo from './components/PrimaryInfo';
import CategoryInfo from './components/CategoryInfo';
import Pricing from './components/Pricing';
import Stock from './components/Stock';
import fields from '../../fields';

const formItems = Object
  .keys(fields)
  .reduce((obj, key) => {
    const { label, component, required, ...restProps } = fields[key];
    const rules = required && [{ required: true }];

    return ({
      ...obj,
      [key]: (
        <Form.Item
          label={label}
          name={key}
          rules={rules}
          {...restProps}
        >
          {component || <Input />}
        </Form.Item>
      ),
    });
  }, {});

class NewItemModal extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    this.state = {
      loading: false,
    }

    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
  }

  setInitialValues() {
    const { initialData } = this.props;
    this.formRef.current.setFieldsValue(initialData);
  }

  async add(values) {
    const { hideModal } = this.props;
    
    values.createdTime = new Date();

    this.setState({ loading: true });

    try {
      await items.add(values);

      message.success(`Item ${values.name} has been added`);
      hideModal();
    } catch(err) {
      message.error(`Something went wrong while adding item ${values.name}`);
    } finally {
      this.setState({ loading: false });
    }
  };

  async update(values) {
    const { initialData, hideModal } = this.props;
    
    values.lastModifiedTime = new Date();

    this.setState({ loading: true });

    try {
      await items.update(data.id, values);

      message.success(`Item ${values.name} has been updated`);
      // hideModal();
    } catch(err) {
      message.error(`Something went wrong while updating item ${values.name}`);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { initialData, onCancel, ...props } = this.props;
    const { loading } = this.state;
    const title = `${initialData ? "Edit" : "Add New"} Item`;

    return (
      <Modal
        {...props}
        title={title}
        width={1000}
        footer={null}
        onCancel={onCancel}
      >
        <Form
          labelCol={{ span: 6 }}
          ref={this.formRef}
          initialValues={initialData}
          onFinish={initialData ? this.update : this.add}
        >
          <PrimaryInfo formItems={formItems} />
          <Divider />
          <CategoryInfo formRef={this.formRef} formItems={formItems} />
          <Divider />
          <Pricing formItems={formItems} />
          {initialData ? (null) : (
            <>
              <Divider />
              <Stock formItems={formItems} />
            </>            
          )}
          <SimpleFooter loading={loading} onCancel={onCancel} />
        </Form>
      </Modal>
    );
  }
}

export default NewItemModal;