import React, { Component } from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import accounting from '../../../../../../utils/accounting';
import './total.less';

const GstWrapper = styled.div`
  margin-top: 15px;
`;

const ShippingWrapper = styled.div`
  margin-top: 15px;
`;

const AdjustmentWrapper = styled.div`
  margin-top: 15px;
`
const TotalWrapper = styled.h2`
  margin-top: 20px;
`;

const TextWrapper = styled.span`
  font-size: 14px;
`;
class Total extends Component {
  constructor(props) {
    super(props);
    const { initialData } = this.props;
    this.state = {
      shipment: initialData ? initialData.shipmentPrice : 0,
      adjustment: initialData ? initialData.adjustmentPrice : 0,
    };

    this.handleAdjustment = this.handleAdjustment.bind(this);
    this.setShipping = this.setShipping.bind(this);
    this.setAdjust = this.setAdjust.bind(this);
  }

  handleAdjustment(setter) {
    return (e) => {
      const number = parseFloat(e.target.value);
      if(!number) return setter(0);
      return setter(number);
    }
  }

  setShipping(shipment) {
    this.setState({ shipment });
  };

  setAdjust(adjustment) {
    this.setState({ adjustment });
  };

  componentDidUpdate(prevProps, prevState) {
    const { dataSource, getPrice } = this.props;
    const { shipment, adjustment } = this.state;
    if (prevProps.dataSource != dataSource || prevState.shipment != shipment || prevState.adjustment != adjustment) {
      let subTotal = dataSource.reduce((prev, cur) => prev + cur.amount, 0);
      let total = subTotal + shipment + adjustment;
      getPrice(total, shipment, adjustment);
    } else {
      return false; 
    }
  }

  render() {
    const { dataSource, initialData, applyGst } = this.props;
    const { shipment, adjustment } = this.state;
    let subTotal = dataSource.reduce((prev, cur) => prev + cur.amount, 0);
    subTotal = accounting.toFixedNumber2(subTotal);
    let gst = accounting.calcGst(subTotal, applyGst);
    let total = subTotal + gst + shipment + adjustment;

    return (
      <div className="total">
        <div>
          <TextWrapper>Sub Total</TextWrapper>
          <span>{subTotal.toFixed(2)}</span>
        </div>
        <GstWrapper>
          <TextWrapper>GST (10%)</TextWrapper>
          <span>{gst.toFixed(2)}</span>
        </GstWrapper>
        <ShippingWrapper>
          <TextWrapper>Shipping Charges</TextWrapper>
          <Input 
            className="inp" 
            onChange={this.handleAdjustment(this.setShipping)}  
            pattern="^[0-9\.]+$"
            title="Please enter a number"
          />
          <span>{shipment.toFixed(2)}</span>
        </ShippingWrapper>
        <AdjustmentWrapper>
          <TextWrapper>Adjustment</TextWrapper>
          <Input
            className="inp"
            onChange={this.handleAdjustment(this.setAdjust)}
            pattern="^[0-9\.]+$"
            title="Please enter a number"
          />
          <span>{adjustment.toFixed(2)}</span>
        </AdjustmentWrapper>
        <TotalWrapper>
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </TotalWrapper>
      </div>
    );
  }
}

export default Total;