import React, { PropTypes } from 'react';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

const galPng = require('./../images/gal.png');
const delPng = require('./../images/del.png');


const Card = (props) => {
  const { style, item } = props;

  return (
    <div style={style} className="desk-item" id={style ? item.id : null}>
      <div className="desk-item-name">{item.title}</div>
      <div className="desk-item-container">
        <div className="desk-item-avatar-wrap">
          <img src={`https://randomuser.me/api/portraits/med/men/${item.id}.jpg`} alt="" />
        </div>
        <div className="desk-item-content">
          <div className="desk-item-author">{`${item.firstName} ${item.lastName}`}</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, banditos.</p>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = propTypes;

export default Card
