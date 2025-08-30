import React from 'react';
import { AiFillInstagram, AiFillGithub, AiFillLinkedin } from 'react-icons/ai';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <div className="footer-container">
      <p> {currentYear} Ayush's E-Commerce. All rights reserved</p>
      <p className="icons">
        <a href="https://github.com/akhanal07" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <AiFillGithub />
        </a>
        <a href="https://www.linkedin.com/in/ayush-khanal-385a71267/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <AiFillLinkedin />
        </a>
        <a href="https://www.instagram.com/ayushkhanal_07?igsh=MW04ankzZHppdWhydQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <AiFillInstagram />
        </a>
      </p>
    </div>
  )
}

export default Footer