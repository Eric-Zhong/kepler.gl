import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Moon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-moon'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_85_57878)">
            <path d="M6.75138 2.7068C6.52216 3.68541 6.49097 4.69999 6.65965 5.69083C6.82833 6.68168 7.19347 7.62878 7.73358 8.47643C8.2737 9.32407 8.97788 10.0551 9.80471 10.6266C10.6315 11.1981 11.5643 11.5984 12.5481 11.8041C12.0309 12.3392 11.4113 12.765 10.7264 13.0561C10.0414 13.3472 9.30494 13.4977 8.56068 13.4987C8.49143 13.4987 8.42158 13.5013 8.35178 13.4987C7.05611 13.4529 5.81743 12.9547 4.85087 12.0906C3.88431 11.2265 3.25093 10.0512 3.06075 8.76875C2.87057 7.48629 3.13559 6.17773 3.80979 5.07034C4.48399 3.96295 5.52478 3.12669 6.75138 2.7068ZM7.49013 1.5C7.46086 1.50005 7.43165 1.50266 7.40283 1.5078C5.81071 1.79059 4.37954 2.65251 3.38498 3.92753C2.39042 5.20254 1.90282 6.80048 2.0161 8.41355C2.12938 10.0266 2.83552 11.5407 3.99852 12.6642C5.16152 13.7877 6.69911 14.4412 8.31513 14.4986C8.39718 14.5016 8.47923 14.4986 8.56058 14.4986C9.60999 14.4992 10.6441 14.2471 11.5755 13.7636C12.5069 13.2801 13.3082 12.5794 13.9116 11.7208C13.9605 11.6469 13.9891 11.5613 13.9944 11.4728C13.9997 11.3842 13.9816 11.2958 13.9419 11.2165C13.9022 11.1372 13.8423 11.0698 13.7682 11.021C13.6941 10.9722 13.6085 10.9438 13.5199 10.9386C12.521 10.851 11.5556 10.5349 10.6984 10.0146C9.84118 9.49439 9.11506 8.784 8.57617 7.93837C8.03728 7.09274 7.70006 6.13452 7.59057 5.13777C7.48108 4.14102 7.60226 3.13245 7.94473 2.19C7.97387 2.1146 7.98457 2.03332 7.97594 1.95295C7.96731 1.87257 7.93961 1.79542 7.89514 1.72792C7.85066 1.66042 7.79071 1.60452 7.72026 1.56487C7.64981 1.52523 7.57091 1.50299 7.49013 1.5Z" />
          </g>
          <defs>
            <clipPath id="clip0_85_57878">
              <rect width="16" height="16" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}