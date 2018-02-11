import React from 'react';
import PropTypes from 'prop-types';
import TAG_LIST from '../../constants/tagList';
import './tagToggle.css';

const TagToggle = ({tag, onToggleChange}) => {
  switch (tag){
    case TAG_LIST.PERSONAL:
      return (
        <label className="tag-toggle btn btn-primary" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    case TAG_LIST.KIDS:
      return (
        <label className="tag-toggle btn btn-success" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    case TAG_LIST.FRIENDS:
      return (
        <label className="tag-toggle btn btn-info" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    case TAG_LIST.FAMILY:
      return (
        <label className="tag-toggle btn btn-warning" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    case TAG_LIST.WORK:
      return (
        <label className="tag-toggle btn btn-danger" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    case TAG_LIST.HOME:
      return (
        <label className="tag-toggle btn btn-info" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );

    default:
      return (
        <label className="tag-toggle btn btn-default" onClick={onToggleChange}>
          <input name="tags" value={tag} type="checkbox" autoComplete="off"/>
          {tag}
          <i className="fa fa-times tag-cancel"/>
        </label>
      );
  }
};

TagToggle.propTypes = {
  tag: PropTypes.string.isRequired,
  onToggleChange: PropTypes.func.isRequired
};

export default TagToggle;