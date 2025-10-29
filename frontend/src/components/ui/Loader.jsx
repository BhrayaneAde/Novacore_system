import React from 'react';

const Loader = ({ size = 48, className = '' }) => {
  const loaderStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    border: '3px solid',
    borderColor: '#055169 #055169 transparent transparent',
    boxSizing: 'border-box',
    animation: 'rotation 1s linear infinite'
  };

  return (
    <>
      <style>{`
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotationBack {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .nova-loader::after,
        .nova-loader::before {
          content: '';  
          box-sizing: border-box;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          border: 3px solid;
          border-color: transparent transparent #f59e0b #f59e0b;
          width: ${size * 0.83}px;
          height: ${size * 0.83}px;
          border-radius: 50%;
          animation: rotationBack 0.5s linear infinite;
          transform-origin: center center;
        }
        .nova-loader::before {
          width: ${size * 0.67}px;
          height: ${size * 0.67}px;
          border-color: #055169 #055169 transparent transparent;
          animation: rotation 1.5s linear infinite;
        }
      `}</style>
      <div className={`nova-loader ${className}`} style={loaderStyle}></div>
    </>
  );
};

export default Loader;