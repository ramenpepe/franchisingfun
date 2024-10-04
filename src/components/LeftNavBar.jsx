import React, { useState } from 'react';
import * as ReactIcons from 'react-icons/fa'; // Import all icons from the 'react-icons/fa' library

import TokenIcon from '@mui/icons-material/Token';
const LeftNavBar = ({ handleNavItemClick, activeItem, setActiveItem, isNavVisible, setIsNavVisible }) => {
  
  const [hoveredItem, setHoveredItem] = useState('');

  const toggleNavVisibility = () => {
    setIsNavVisible((prevState) => !prevState);
  };

  const handleItemClick = (item) => {
    handleNavItemClick(item);
    
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  const navItems = [
    { label: 'Market', value: 'Marketplace', icon: ReactIcons.FaDesktop },
    { label: 'Launch', value: 'Launch', icon: TokenIcon },
    { label: 'My Portfolio', value: 'Portfolio', icon: ReactIcons.FaBook },
    { label: 'Governance', value: 'Governance', icon: ReactIcons.FaFileContract },
    { label: 'Community', value: 'Community', icon: ReactIcons.FaCog }
    
    
  ];

  return (
    <div>
      <div className={`left-nav-bar ${isNavVisible ? '' : 'hidden'}`}>
        <div className="bar"></div>
        <ul className={`nav-list ${isNavVisible ? 'visible' : 'hidden'}`}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.value}
                className={`nav-item ${activeItem === item.value ? 'active' : ''}`}
                onClick={() => handleItemClick(item.value)}
                onMouseEnter={() => handleMouseEnter(item.value)}
                onMouseLeave={handleMouseLeave}
              >
                <IconComponent /><label>{item.label}</label>
              </li>
            );
          })}
        </ul>
        <div className={`placeholder-text ${hoveredItem ? 'visible' : ''}`} >
          <h2 >{hoveredItem ? hoveredItem : ''}</h2>
        </div>
      </div>

      <button className="toggle-button" onClick={toggleNavVisibility}>
        {isNavVisible ? <ReactIcons.FaCaretLeft /> : <ReactIcons.FaCaretRight />}
      </button>
    </div>
  );
};

export default LeftNavBar;
