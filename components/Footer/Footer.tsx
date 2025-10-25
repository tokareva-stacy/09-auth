import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Anastasiia Tokarieva</p>
          <p>
            Contact us:&nbsp;
            <a href="mailto:tokarevanyura@gmail.com">tokarevanyura@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
