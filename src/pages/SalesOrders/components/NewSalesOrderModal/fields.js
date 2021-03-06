import React from 'react';
import { Input, DatePicker, Checkbox } from 'antd';
import moment from 'moment';

export default {
  salesorderNumber: {
    label: "Sales Order#",
    rules: [
      {
        required: true,
      },
    ],
    children: <Input />,
  },
  referenceNumber: {
    label: "Reference#",
    children: <Input />,
  },
  date: {
    label: "Sales Order Date",
    rules: [
      {
        required: true,
      },
    ],
    children: 
    <DatePicker
      initialValue={moment()} 
      format="DD/MM/YYYY" 
    />
  },
  applyGst: {
    title: 'Apply GST',
    label: ' ',
    colon: false,
    valuePropName: 'checked',
    children: (
      <Checkbox>Apply GST</Checkbox>
    ),
  },
};