import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        Developed by{' '}
        <a
          href="https://batuhankendirli.netlify.app/"
          target={'_blank'}
          className="footer-link"
        >
          Batuhan Kendirli
        </a>
      </span>
      <ul className="footer-social">
        <li>
          <a href="https://github.com/batuhankendirli" target={'_blank'}>
            <ion-icon name="logo-github"></ion-icon>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/batuhan-kendirli/"
            target={'_blank'}
          >
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
        </li>
        <li>
          <a href="mailto:batuhankndrl@gmail.com" target={'_blank'}>
            <ion-icon name="mail"></ion-icon>
          </a>
        </li>
      </ul>
    </footer>
  );
}
