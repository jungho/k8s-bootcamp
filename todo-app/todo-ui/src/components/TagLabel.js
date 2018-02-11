import React from 'react';
import PropTypes from 'prop-types';
import TAG_LIST from '../constants/tagList';

const TagLabel = ({tag, onSelect}) => {
    switch (tag){
      case TAG_LIST.PERSONAL:
        return <span className="label label-primary" onClick={onSelect}>{tag}</span>;

      case TAG_LIST.KIDS:
        return <span className="label label-success">{tag}</span>;

      case TAG_LIST.FRIENDS:
        return <span className="label label-info">{tag}</span>;

      case TAG_LIST.FAMILY:
        return <span className="label label-warning">{tag}</span>;

      case TAG_LIST.WORK:
        return <span className="label label-danger">{tag}</span>;

      case TAG_LIST.HOME:
        return <span className="label label-info">{tag}</span>;

      default:
        return <span className="label label-default">{tag}</span>;
    }
};

TagLabel.propTypes = {
  tag: PropTypes.string.isRequired,
  onSelect: PropTypes.func
};

export default TagLabel;